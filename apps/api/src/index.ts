import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import {
  ensureSchema,
  upsertUser,
  getGrades,
  insertCadetFile,
  listCadetFilesByEmail,
  listAllFiles,
  updateFileStatus,
  insertMessage,
  listMessagesPaged,
  markMessageRead,
  listAttendance,
  logAttendance,
  listAllAttendance,
  listUsers,
  workflowSummary,
  analyticsSummary
} from './db'

const app = Fastify({ logger: true })

await app.register(cors, { origin: true })

app.get('/health', async () => ({ status: 'ok' }))

const LoginBody = z.object({
  email: z.string().email(),
  role: z.enum([
    'Cadet',
    'Officer',
    'Staff',
    'ROTC Coordinator',
    'NSTP Coordinator',
    'Corp Commander',
    'Commandant',
    'System Admin'
  ])
})

const adminEmails = new Set<string>((process.env.ADMIN_EMAILS ? String(process.env.ADMIN_EMAILS).split(',').map((s) => s.trim()) : ['msusndrotcunit@gmail.com', 'junjiebatcom09@gmail.com']).filter(Boolean))

app.post('/auth/login', async (req, reply) => {
  const parsed = LoginBody.safeParse(req.body)
  if (!parsed.success) {
    return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.flatten() })
  }
  const { email, role } = parsed.data
  if (role === 'System Admin' && !adminEmails.has(email)) {
    return reply.code(403).send({ error: 'Forbidden role' })
  }
  await upsertUser(email, role)
  const token = jwt.sign({ sub: email, role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' })
  return { token }
})

type Grade = { attendance: number; militaryAptitude: number; exams: number }
type FileMeta = { id: string; cadetId: string; status: 'Pending' | 'Approved' | 'Rejected'; fileType: 'Excuse' | 'Medical' | 'Complaint'; filename: string; url: string | null; createdAt: string; remark?: string }
const gradesStore = new Map<string, Grade>()
const filesStore = new Map<string, FileMeta[]>()
const messagesStore: { id: string; from: string; toRole: string; content: string; createdAt: string }[] = []
const usersStore = new Map<string, string>()
const staffAttendanceStore = new Map<string, { timestamp: string; qr: string }[]>()

function verify(req: any) {
  const h = req.headers['authorization']
  if (!h || !h.startsWith('Bearer ')) return null
  try {
    const token = h.slice(7)
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { sub: string; role: string }
  } catch {
    return null
  }
}

app.get('/me', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  return { email: u.sub, role: u.role }
})

app.get('/cadet/grades', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'Cadet') return reply.code(403).send({ error: 'Forbidden' })
  return await getGrades(u.sub)
})

const UploadBody = z.object({
  cadetId: z.string(),
  fileType: z.enum(['Excuse', 'Medical', 'Complaint']),
  filename: z.string(),
  url: z.string().optional()
})

app.post('/cadet/files', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'Cadet') return reply.code(403).send({ error: 'Forbidden' })
  const parsed = UploadBody.safeParse(req.body)
  if (!parsed.success) {
    return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.flatten() })
  }
  const { cadetId, fileType, filename, url } = parsed.data
  if (cadetId !== u.sub) return reply.code(403).send({ error: 'Forbidden' })
  const meta: FileMeta = {
    id: `meta_${Date.now()}`,
    cadetId,
    status: 'Pending',
    fileType,
    filename,
    url: url ?? null,
    createdAt: new Date().toISOString()
  }
  await insertCadetFile(meta)
  return meta
})

app.get('/cadet/files', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'Cadet') return reply.code(403).send({ error: 'Forbidden' })
  let data: FileMeta[] = await listCadetFilesByEmail(u.sub) as FileMeta[]
  const q = req.query as any
  const page = Math.max(1, Number(q?.page ?? 1))
  const pageSize = Math.max(1, Math.min(50, Number(q?.pageSize ?? 10)))
  const status = typeof q?.status === 'string' && ['Pending', 'Approved', 'Rejected'].includes(q.status) ? q.status : undefined
  const fileType = typeof q?.fileType === 'string' && ['Excuse', 'Medical', 'Complaint'].includes(q.fileType) ? q.fileType : undefined
  const sort = typeof q?.sort === 'string' && ['asc', 'desc'].includes(q.sort) ? q.sort : 'desc'
  if (status) data = data.filter((f) => f.status === status)
  if (fileType) data = data.filter((f) => f.fileType === fileType)
  data = data.sort((a, b) => (sort === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)))
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return { items: data.slice(start, end), total: data.length, page, pageSize }
})

app.get('/messages', async (req) => {
  const q = req.query as any
  const page = Math.max(1, Number(q?.page ?? 1))
  const pageSize = Math.max(1, Math.min(50, Number(q?.pageSize ?? 10)))
  const toRole = typeof q?.toRole === 'string' ? q.toRole : undefined
  const readParam = typeof q?.read === 'string' ? q.read : undefined
  const read = readParam === 'true' ? true : readParam === 'false' ? false : undefined
  return await listMessagesPaged({ toRole, page, pageSize, read })
})

app.post('/messages', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  const body = z.object({ toRole: z.string(), content: z.string().min(1) }).safeParse(req.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid payload', details: body.error.flatten() })
  const m = { id: `msg_${Date.now()}`, from: u.sub, toRole: body.data.toRole, content: body.data.content, createdAt: new Date().toISOString(), read: false, readAt: null }
  await insertMessage(m)
  return m
})
app.patch('/messages/:id/read', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  const id = (req.params as any).id as string
  const body = z.object({ read: z.boolean() }).safeParse(req.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid payload', details: body.error.flatten() })
  const updated = await markMessageRead(id, body.data.read)
  if (!updated) return reply.code(404).send({ error: 'Not found' })
  return updated
})

app.get('/officer/files', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'Officer') return reply.code(403).send({ error: 'Forbidden' })
  let data: FileMeta[] = await listAllFiles() as FileMeta[]
  const q = req.query as any
  const page = Math.max(1, Number(q?.page ?? 1))
  const pageSize = Math.max(1, Math.min(50, Number(q?.pageSize ?? 10)))
  const status = typeof q?.status === 'string' && ['Pending', 'Approved', 'Rejected'].includes(q.status) ? q.status : undefined
  const fileType = typeof q?.fileType === 'string' && ['Excuse', 'Medical', 'Complaint'].includes(q.fileType) ? q.fileType : undefined
  const sort = typeof q?.sort === 'string' && ['asc', 'desc'].includes(q.sort) ? q.sort : 'desc'
  if (status) data = data.filter((f) => f.status === status)
  if (fileType) data = data.filter((f) => f.fileType === fileType)
  data = data.sort((a, b) => (sort === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)))
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return { items: data.slice(start, end), total: data.length, page, pageSize }
})

app.post('/officer/files/:id/status', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'Officer') return reply.code(403).send({ error: 'Forbidden' })
  const id = (req.params as any).id as string
  const body = z.object({ status: z.enum(['Approved', 'Rejected']), remark: z.string().optional() }).safeParse(req.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid payload', details: body.error.flatten() })
  const updated = await updateFileStatus(id, body.data.status, body.data.remark)
  if (!updated) return reply.code(404).send({ error: 'Not found' })
  return updated
})

app.get('/coordinator/files', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (!['ROTC Coordinator', 'NSTP Coordinator'].includes(u.role)) return reply.code(403).send({ error: 'Forbidden' })
  let data: FileMeta[] = await listAllFiles() as FileMeta[]
  const q = req.query as any
  const page = Math.max(1, Number(q?.page ?? 1))
  const pageSize = Math.max(1, Math.min(50, Number(q?.pageSize ?? 10)))
  const status = typeof q?.status === 'string' && ['Pending', 'Approved', 'Rejected'].includes(q.status) ? q.status : undefined
  const fileType = typeof q?.fileType === 'string' && ['Excuse', 'Medical', 'Complaint'].includes(q.fileType) ? q.fileType : undefined
  const sort = typeof q?.sort === 'string' && ['asc', 'desc'].includes(q.sort) ? q.sort : 'desc'
  if (status) data = data.filter((f) => f.status === status)
  if (fileType) data = data.filter((f) => f.fileType === fileType)
  data = data.sort((a, b) => (sort === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)))
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return { items: data.slice(start, end), total: data.length, page, pageSize }
})

app.post('/coordinator/files/:id/status', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (!['ROTC Coordinator', 'NSTP Coordinator'].includes(u.role)) return reply.code(403).send({ error: 'Forbidden' })
  const id = (req.params as any).id as string
  const body = z.object({ status: z.enum(['Approved', 'Rejected']), remark: z.string().optional() }).safeParse(req.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid payload', details: body.error.flatten() })
  const updated = await updateFileStatus(id, body.data.status, body.data.remark)
  if (!updated) return reply.code(404).send({ error: 'Not found' })
  return updated
})

app.get('/admin/workflow', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'System Admin') return reply.code(403).send({ error: 'Forbidden' })
  return await workflowSummary()
})

app.get('/analytics', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (!['Corp Commander', 'Commandant', 'System Admin'].includes(u.role)) return reply.code(403).send({ error: 'Forbidden' })
  return await analyticsSummary()
})

app.post('/staff/attendance', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'Staff') return reply.code(403).send({ error: 'Forbidden' })
  const body = z.object({ qr: z.string().min(1) }).safeParse(req.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid payload', details: body.error.flatten() })
  const entry = await logAttendance(u.sub, body.data.qr)
  return entry
})

app.get('/staff/attendance', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'Staff') return reply.code(403).send({ error: 'Forbidden' })
  return await listAttendance(u.sub)
})

app.get('/admin/staff/attendance', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'System Admin') return reply.code(403).send({ error: 'Forbidden' })
  return await listAllAttendance()
})

app.get('/admin/users', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'System Admin') return reply.code(403).send({ error: 'Forbidden' })
  return await listUsers()
})

app.post('/admin/users/set-role', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  if (u.role !== 'System Admin') return reply.code(403).send({ error: 'Forbidden' })
  const body = z.object({ email: z.string().email(), role: z.string() }).safeParse(req.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid payload', details: body.error.flatten() })
  await upsertUser(body.data.email, body.data.role)
  return { email: body.data.email, role: body.data.role }
})

app.post('/storage/sign', async (req, reply) => {
  const u = verify(req)
  if (!u) return reply.code(401).send({ error: 'Unauthorized' })
  const body = z.object({ filename: z.string().min(1) }).safeParse(req.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid payload', details: body.error.flatten() })
  const id = `file_${Date.now()}`
  const fileUrl = `https://storage.local/${id}/${body.data.filename}`
  return { id, fileUrl }
})

const port = Number(process.env.PORT || 3001)
await ensureSchema()
for (const e of adminEmails) {
  await upsertUser(e, 'System Admin')
}
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
