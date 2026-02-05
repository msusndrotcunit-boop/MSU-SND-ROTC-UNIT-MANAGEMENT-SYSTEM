// Dynamic import to avoid native module load when DB env is not configured

type Grade = { attendance: number; militaryAptitude: number; exams: number }
type FileMeta = { id: string; cadetId: string; status: 'Pending' | 'Approved' | 'Rejected'; fileType: 'Excuse' | 'Medical' | 'Complaint'; filename: string; url: string | null; createdAt: string; remark?: string }
type Message = { id: string; from: string; toRole: string; content: string; createdAt: string; read: boolean; readAt?: string | null }

const useMemory = !process.env.TURSO_DB_URL || !process.env.TURSO_DB_TOKEN

let db: any = null
if (!useMemory) {
  const mod = await import('@libsql/client')
  db = mod.createClient({ url: process.env.TURSO_DB_URL as string, authToken: process.env.TURSO_DB_TOKEN as string })
}

const mem = {
  users: new Map<string, string>(),
  grades: new Map<string, Grade>(),
  files: new Map<string, FileMeta[]>(),
  messages: [] as Message[],
  staffAttendance: new Map<string, { timestamp: string; qr: string }[]>()
}

export async function ensureSchema() {
  if (useMemory || !db) return
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      role TEXT NOT NULL
    );
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS grades (
      email TEXT PRIMARY KEY,
      attendance INTEGER,
      militaryAptitude INTEGER,
      exams INTEGER
    );
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cadet_files (
      id TEXT PRIMARY KEY,
      cadet_id TEXT NOT NULL,
      status TEXT NOT NULL,
      file_type TEXT NOT NULL,
      filename TEXT NOT NULL,
      url TEXT,
      remark TEXT,
      created_at TEXT NOT NULL
    );
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_cadet_files_cadet ON cadet_files(cadet_id);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_cadet_files_created ON cadet_files(created_at);`)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender TEXT NOT NULL,
      to_role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(to_role);`)
  try {
    await db.execute(`ALTER TABLE messages ADD COLUMN read INTEGER NOT NULL DEFAULT 0`)
  } catch {}
  try {
    await db.execute(`ALTER TABLE messages ADD COLUMN read_at TEXT`)
  } catch {}
  await db.execute(`
    CREATE TABLE IF NOT EXISTS staff_attendance (
      id TEXT PRIMARY KEY,
      staff TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      qr TEXT NOT NULL
    );
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_att_staff ON staff_attendance(staff);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_att_time ON staff_attendance(timestamp);`)
}

export async function upsertUser(email: string, role: string) {
  if (useMemory || !db) {
    mem.users.set(email, role)
    return { email, role }
  }
  await db.execute({
    sql: `INSERT INTO users (email, role) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET role=excluded.role`,
    args: [email, role]
  })
  return { email, role }
}

export async function listUsers() {
  if (useMemory || !db) {
    return Array.from(mem.users.entries()).map(([email, role]) => ({ email, role }))
  }
  const res = await db.execute(`SELECT email, role FROM users ORDER BY email`)
  return res.rows.map((r: any) => ({ email: r.email as string, role: r.role as string }))
}

export async function getGrades(email: string) {
  if (useMemory || !db) {
    if (!mem.grades.has(email)) mem.grades.set(email, { attendance: 85, militaryAptitude: 90, exams: 88 })
    return mem.grades.get(email)!
  }
  const res = await db.execute({ sql: `SELECT attendance, militaryAptitude, exams FROM grades WHERE email=?`, args: [email] })
  if (res.rows.length === 0) {
    await db.execute({ sql: `INSERT INTO grades (email, attendance, militaryAptitude, exams) VALUES (?, ?, ?, ?)`, args: [email, 85, 90, 88] })
    return { attendance: 85, militaryAptitude: 90, exams: 88 }
  }
  const r = res.rows[0] as any
  return { attendance: Number(r.attendance), militaryAptitude: Number(r.militaryAptitude), exams: Number(r.exams) }
}

export async function insertCadetFile(meta: FileMeta) {
  if (useMemory || !db) {
    const arr = mem.files.get(meta.cadetId) || []
    arr.push(meta)
    mem.files.set(meta.cadetId, arr)
    return meta
  }
  await db.execute({
    sql: `INSERT INTO cadet_files (id, cadet_id, status, file_type, filename, url, remark, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [meta.id, meta.cadetId, meta.status, meta.fileType, meta.filename, meta.url, meta.remark ?? null, meta.createdAt]
  })
  return meta
}

export async function listCadetFilesByEmail(email: string) {
  if (useMemory || !db) {
    return mem.files.get(email) || []
  }
  const res = await db.execute({ sql: `SELECT id, cadet_id, status, file_type, filename, url, remark, created_at FROM cadet_files WHERE cadet_id=? ORDER BY created_at DESC`, args: [email] })
  return res.rows.map((r: any) => ({
    id: r.id as string,
    cadetId: r.cadet_id as string,
    status: r.status as FileMeta['status'],
    fileType: r.file_type as FileMeta['fileType'],
    filename: r.filename as string,
    url: (r.url as string) ?? null,
    remark: r.remark as string,
    createdAt: r.created_at as string
  }))
}

export async function listAllFiles() {
  if (useMemory || !db) {
    return Array.from(mem.files.values()).flat()
  }
  const res = await db.execute(`SELECT id, cadet_id, status, file_type, filename, url, remark, created_at FROM cadet_files ORDER BY created_at DESC`)
  return res.rows.map((r: any) => ({
    id: r.id as string,
    cadetId: r.cadet_id as string,
    status: r.status as FileMeta['status'],
    fileType: r.file_type as FileMeta['fileType'],
    filename: r.filename as string,
    url: (r.url as string) ?? null,
    remark: r.remark as string,
    createdAt: r.created_at as string
  }))
}

export async function updateFileStatus(id: string, status: 'Approved' | 'Rejected', remark?: string) {
  if (useMemory || !db) {
    for (const [cadetId, arr] of mem.files.entries()) {
      const idx = arr.findIndex((f) => f.id === id)
      if (idx >= 0) {
        arr[idx] = { ...arr[idx], status, remark }
        mem.files.set(cadetId, arr)
        return arr[idx]
      }
    }
    return null
  }
  await db.execute({ sql: `UPDATE cadet_files SET status=?, remark=? WHERE id=?`, args: [status, remark ?? null, id] })
  const res = await db.execute({ sql: `SELECT id, cadet_id, status, file_type, filename, url, remark, created_at FROM cadet_files WHERE id=?`, args: [id] })
  if (res.rows.length === 0) return null
  const r = res.rows[0] as any
  return {
    id: r.id as string,
    cadetId: r.cadet_id as string,
    status: r.status as FileMeta['status'],
    fileType: r.file_type as FileMeta['fileType'],
    filename: r.filename as string,
    url: (r.url as string) ?? null,
    remark: r.remark as string,
    createdAt: r.created_at as string
  } as FileMeta
}

export async function insertMessage(msg: Message) {
  if (useMemory || !db) {
    mem.messages.unshift(msg)
    return msg
  }
  await db.execute({
    sql: `INSERT INTO messages (id, sender, to_role, content, created_at, read, read_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [msg.id, msg.from, msg.toRole, msg.content, msg.createdAt, msg.read ? 1 : 0, msg.readAt ?? null]
  })
  return msg
}

export async function listMessages() {
  if (useMemory || !db) {
    return mem.messages
  }
  const res = await db.execute(`SELECT id, sender, to_role, content, created_at, read, read_at FROM messages ORDER BY created_at DESC`)
  return res.rows.map((r: any) => ({ id: r.id as string, from: r.sender as string, toRole: r.to_role as string, content: r.content as string, createdAt: r.created_at as string, read: Number(r.read) === 1, readAt: (r.read_at as string) ?? null })) as Message[]
}

export async function listMessagesPaged(opts: { toRole?: string; page: number; pageSize: number; read?: boolean }) {
  const { toRole, page, pageSize, read } = opts
  if (useMemory || !db) {
    let all = toRole ? mem.messages.filter((m) => m.toRole === toRole) : mem.messages
    if (typeof read === 'boolean') all = all.filter((m) => m.read === read)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return { items: all.slice(start, end), total: all.length, page, pageSize }
  }
  const whereClauses: string[] = []
  const args: any[] = []
  if (toRole) {
    whereClauses.push('to_role=?')
    args.push(toRole)
  }
  if (typeof read === 'boolean') {
    whereClauses.push('read=?')
    args.push(read ? 1 : 0)
  }
  const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''
  const totalRes = await db.execute({ sql: `SELECT COUNT(*) AS c FROM messages ${where}`, args })
  const total = Number(totalRes.rows[0].c)
  const itemsRes = await db.execute({
    sql: `SELECT id, sender, to_role, content, created_at, read, read_at FROM messages ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [...args, pageSize, (page - 1) * pageSize]
  })
  const items = itemsRes.rows.map((r: any) => ({ id: r.id as string, from: r.sender as string, toRole: r.to_role as string, content: r.content as string, createdAt: r.created_at as string, read: Number(r.read) === 1, readAt: (r.read_at as string) ?? null })) as Message[]
  return { items, total, page, pageSize }
}
export async function markMessageRead(id: string, read: boolean) {
  const readAt = read ? new Date().toISOString() : null
  if (useMemory || !db) {
    const idx = mem.messages.findIndex((m) => m.id === id)
    if (idx >= 0) {
      mem.messages[idx] = { ...mem.messages[idx], read, readAt }
      return mem.messages[idx]
    }
    return null
  }
  await db.execute({ sql: `UPDATE messages SET read=?, read_at=? WHERE id=?`, args: [read ? 1 : 0, readAt, id] })
  const res = await db.execute({ sql: `SELECT id, sender, to_role, content, created_at, read, read_at FROM messages WHERE id=?`, args: [id] })
  if (res.rows.length === 0) return null
  const r = res.rows[0] as any
  return { id: r.id as string, from: r.sender as string, toRole: r.to_role as string, content: r.content as string, createdAt: r.created_at as string, read: Number(r.read) === 1, readAt: (r.read_at as string) ?? null } as Message
}
export async function logAttendance(staff: string, qr: string) {
  const entry = { timestamp: new Date().toISOString(), qr }
  if (useMemory || !db) {
    const arr = mem.staffAttendance.get(staff) || []
    arr.push(entry)
    mem.staffAttendance.set(staff, arr)
    return entry
  }
  const id = `att_${Date.now()}`
  await db.execute({ sql: `INSERT INTO staff_attendance (id, staff, timestamp, qr) VALUES (?, ?, ?, ?)`, args: [id, staff, entry.timestamp, qr] })
  return entry
}

export async function listAttendance(staff: string) {
  if (useMemory || !db) {
    return mem.staffAttendance.get(staff) || []
  }
  const res = await db.execute({ sql: `SELECT timestamp, qr FROM staff_attendance WHERE staff=? ORDER BY timestamp DESC`, args: [staff] })
  return res.rows.map((r: any) => ({ timestamp: r.timestamp as string, qr: r.qr as string }))
}

export async function listAllAttendance() {
  if (useMemory || !db) {
    const all: { staff: string; timestamp: string; qr: string }[] = []
    for (const [email, entries] of mem.staffAttendance.entries()) {
      for (const e of entries) all.push({ staff: email, timestamp: e.timestamp, qr: e.qr })
    }
    return all
  }
  const res = await db.execute(`SELECT staff, timestamp, qr FROM staff_attendance ORDER BY timestamp DESC`)
  return res.rows.map((r: any) => ({ staff: r.staff as string, timestamp: r.timestamp as string, qr: r.qr as string }))
}

export async function workflowSummary() {
  if (useMemory || !db) {
    const allFiles = Array.from(mem.files.values()).flat()
    const pending = allFiles.filter((f) => f.status === 'Pending').length
    const approved = allFiles.filter((f) => f.status === 'Approved').length
    const rejected = allFiles.filter((f) => f.status === 'Rejected').length
    return { pending, approved, rejected, messages: mem.messages.length, users: mem.users.size }
  }
  const pending = await db.execute(`SELECT COUNT(*) AS c FROM cadet_files WHERE status='Pending'`)
  const approved = await db.execute(`SELECT COUNT(*) AS c FROM cadet_files WHERE status='Approved'`)
  const rejected = await db.execute(`SELECT COUNT(*) AS c FROM cadet_files WHERE status='Rejected'`)
  const messages = await db.execute(`SELECT COUNT(*) AS c FROM messages`)
  const users = await db.execute(`SELECT COUNT(*) AS c FROM users`)
  const num = (r: any) => Number(r.rows[0].c)
  return { pending: num(pending), approved: num(approved), rejected: num(rejected), messages: num(messages), users: num(users) }
}

export async function analyticsSummary() {
  if (useMemory || !db) {
    const allFiles = Array.from(mem.files.values()).flat()
    const types = ['Excuse', 'Medical', 'Complaint'] as const
    const submissions = types.map((t) => ({ type: t, count: allFiles.filter((f) => f.fileType === t).length }))
    const allGrades = Array.from(mem.grades.values())
    const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0)
    const averages = {
      attendance: avg(allGrades.map((g) => g.attendance)),
      militaryAptitude: avg(allGrades.map((g) => g.militaryAptitude)),
      exams: avg(allGrades.map((g) => g.exams))
    }
    return { submissions, averages }
  }
  const files = await db.execute(`SELECT file_type, COUNT(*) AS c FROM cadet_files GROUP BY file_type`)
  const submissions = (files.rows as any[]).map((r) => ({ type: r.file_type as string, count: Number(r.c) }))
  const grades = await db.execute(`SELECT AVG(attendance) AS a1, AVG(militaryAptitude) AS a2, AVG(exams) AS a3 FROM grades`)
  const r = grades.rows[0] as any
  const averages = {
    attendance: Math.round(Number(r.a1 || 0)),
    militaryAptitude: Math.round(Number(r.a2 || 0)),
    exams: Math.round(Number(r.a3 || 0))
  }
  return { submissions, averages }
}
