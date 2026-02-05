import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'

function IconShield() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5-3.5 9.4-7 10-3.5-.6-7-5-7-10V6l7-4z"/></svg>)
}
function IconFile() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>)
}
function IconUpload() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16V8"/><path d="M8 12l4-4 4 4"/><path d="M4 20h16"/></svg>)
}
function IconCheck() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6L9 17l-5-5"/></svg>)
}
function IconX() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>)
}
function IconMessage() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v9z"/></svg>)
}
function IconQR() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM17 13h4v4h-4zM13 17h4v4h-4z"/></svg>)
}
function IconUser() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z"/><path d="M3 22a9 9 0 0 1 18 0"/></svg>)
}
function IconLogout() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 21V3"/></svg>)
}
function IconGrades() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3z" opacity=".1"/><path d="M7 16h2V8H7zM11 16h2V5h-2zM15 16h2v-6h-2z"/></svg>)
}
function IconWorkflow() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h4v4H6zM14 6h4v4h-4zM10 14h4v4h-4z"/><path d="M10 8h4M12 10v4"/></svg>)
}
function IconBell() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 8a6 6 0 0 1 12 0v4l2 2H4l2-2V8z"/><path d="M9 18a3 3 0 0 0 6 0"/></svg>)
}
function IconMoon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>)
}
function IconSun() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>)
}

function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('Cadet')
  const [error, setError] = React.useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await login(email, role)
    if (!res.ok) setError(res.error || 'Login failed')
    else {
      if (role === 'Cadet') nav('/cadet')
      else if (role === 'Officer') nav('/officer')
      else if (role === 'Staff') nav('/staff')
      else if (role === 'System Admin') nav('/admin')
      else if (role === 'Corp Commander' || role === 'Commandant') nav('/commander')
      else nav('/coordinator')
    }
  }
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input type="email" required className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="w-full rounded border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Cadet</option>
          <option>Officer</option>
          <option>Staff</option>
          <option>ROTC Coordinator</option>
          <option>NSTP Coordinator</option>
          <option>Corp Commander</option>
          <option>Commandant</option>
          <option>System Admin</option>
        </select>
        <button type="submit" className="w-full sm:w-auto rounded bg-blue-600 px-4 py-2 text-white">Sign in</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}


function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title"><span className="inline-flex items-center gap-2"><IconShield /> MSU-SND ROTC Command Portal</span></h1>
          <p className="hero-subtitle">Streamlined submissions, approvals, attendance, and analytics.</p>
          <div className="cta-group">
            <NavLink to="/login" className="btn btn-primary">Sign in</NavLink>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="card-title">Cadet</div>
            <p className="mt-2 text-sm">Upload files, track status, and view grades.</p>
          </div>
          <div className="feature-card">
            <div className="card-title">Officer</div>
            <p className="mt-2 text-sm">Review, remark, and approve submissions quickly.</p>
          </div>
          <div className="feature-card">
            <div className="card-title">Coordinator</div>
            <p className="mt-2 text-sm">Batch actions with simple workflow analytics.</p>
          </div>
          <div className="feature-card">
            <div className="card-title">Staff</div>
            <p className="mt-2 text-sm">QR attendance with camera preview.</p>
          </div>
          <div className="feature-card">
            <div className="card-title">Admin</div>
            <p className="mt-2 text-sm">Manage users and system metrics.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function CadetDashboard() {
  const { token, user, logout } = useAuth()
  const loc = useLocation()
  const envBase = (import.meta as any).env?.VITE_API_URL
  const apiBase = envBase && !String(envBase).includes('your-api-host.example.com') ? envBase : 'http://localhost:3001'
  const [grades, setGrades] = React.useState<{ attendance: number; militaryAptitude: number; exams: number } | null>(null)
  const [files, setFiles] = React.useState<any[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All')
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Excuse' | 'Medical' | 'Complaint'>('All')
  const [sortOrder, setSortOrder] = React.useState<'Newest' | 'Oldest'>('Newest')
  const [file, setFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [messages, setMessages] = React.useState<any[]>([])
  const [msgTotal, setMsgTotal] = React.useState(0)
  const [msgPage, setMsgPage] = React.useState(1)
  const [msgPageSize, setMsgPageSize] = React.useState(10)
  const [readFilter, setReadFilter] = React.useState<'All' | 'Unread' | 'Read'>('All')
  const [unreadTotal, setUnreadTotal] = React.useState(0)
  const [toast, setToast] = React.useState('')
  React.useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/cadet/grades`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setGrades(d))
  }, [token, apiBase])
  React.useEffect(() => {
    if (!token) return
    const qs = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      status: statusFilter === 'All' ? '' : statusFilter,
      fileType: typeFilter === 'All' ? '' : typeFilter,
      sort: sortOrder === 'Newest' ? 'desc' : 'asc'
    })
    fetch(`${apiBase}/cadet/files?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { items: [], total: 0, page, pageSize }))
      .then((d) => {
        setFiles(d.items ?? [])
        setTotal(d.total ?? 0)
      })
  }, [token, page, pageSize, statusFilter, typeFilter, sortOrder, apiBase])
  React.useEffect(() => {
    if (!token) return
    const qs = new URLSearchParams({
      toRole: 'Cadet',
      page: String(msgPage),
      pageSize: String(msgPageSize),
      read: readFilter === 'Unread' ? 'false' : readFilter === 'Read' ? 'true' : ''
    })
    fetch(`${apiBase}/messages?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { items: [], total: 0, page: msgPage, pageSize: msgPageSize }))
      .then((d) => {
        setMessages(d.items ?? [])
        setMsgTotal(d.total ?? 0)
      })
  }, [token, msgPage, msgPageSize, readFilter, apiBase])
  React.useEffect(() => {
    if (!token) return
    const qs = new URLSearchParams({ toRole: 'Cadet', read: 'false', page: '1', pageSize: '1' })
    fetch(`${apiBase}/messages?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { total: 0 }))
      .then((d) => setUnreadTotal(Number(d.total || 0)))
  }, [token, apiBase])
  React.useEffect(() => {
    const v = new URLSearchParams(loc.search).get('view') || ''
    const id = v === 'upload' ? 'cadet-upload' : v === 'files' ? 'cadet-files' : v === 'grades' ? 'cadet-grades' : v === 'messages' ? 'cadet-messages' : ''
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [loc])
  async function toggleMessageRead(id: string, read: boolean) {
    if (!token) return
    const res = await fetch(`${apiBase}/messages/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ read })
    })
    if (res.ok) {
      const updated = await res.json()
      setMessages((arr) => arr.map((m) => (m.id === id ? updated : m)))
      setToast(read ? 'Message marked as read' : 'Message marked as unread')
      setTimeout(() => setToast(''), 2000)
    }
  }
  async function upload(type: string) {
    if (!file || !token || !user) return
    setUploadProgress(5)
    const timer = setInterval(() => setUploadProgress((p) => Math.min(95, p + 10)), 150)
    const sign = await fetch(`${apiBase}/storage/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename: file.name })
    }).then((r) => (r.ok ? r.json() : null))
    const res = await fetch(`${apiBase}/cadet/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cadetId: user.email, fileType: type, filename: file.name, url: sign?.fileUrl })
    })
    if (res.ok) {
      const meta = await res.json()
      setFiles((f) => [meta, ...f])
      setFile(null)
      setUploadProgress(100)
      setToast('Upload complete')
      setTimeout(() => setToast(''), 2000)
    }
    clearInterval(timer)
    setTimeout(() => setUploadProgress(0), 400)
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-semibold">Cadet Dashboard</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <button type="button" onClick={logout} className="rounded border px-3 py-1">Sign out</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel">
          <h3 className="card-title">Quick Stats</h3>
          <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded border p-2">
              <div className="text-xs text-gray-600">Pending Files</div>
              <div className="text-lg font-semibold">{files.filter((f) => f.status === 'Pending').length}</div>
            </div>
            <div className="rounded border p-2">
              <div className="text-xs text-gray-600">Approved Files</div>
              <div className="text-lg font-semibold">{files.filter((f) => f.status === 'Approved').length}</div>
            </div>
            <div className="rounded border p-2">
              <div className="text-xs text-gray-600">Grades Avg</div>
              <div className="text-lg font-semibold">{grades ? Math.round((grades.attendance + grades.militaryAptitude + grades.exams) / 3) : '-'}</div>
            </div>
          </div>
        </div>
        <div id="cadet-upload" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconFile /> File Upload</h3>
          <div className="mt-3 space-y-2">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <button type="button" disabled={!file} onClick={() => upload('Excuse')} className="btn btn-primary disabled:opacity-50 flex items-center gap-2 w-full"><IconUpload /> Upload Excuse</button>
              <button type="button" disabled={!file} onClick={() => upload('Medical')} className="btn btn-success disabled:opacity-50 flex items-center gap-2 w-full"><IconUpload /> Upload Medical</button>
              <button type="button" disabled={!file} onClick={() => upload('Complaint')} className="btn btn-secondary disabled:opacity-50 flex items-center gap-2 w-full"><IconUpload /> Upload Complaint</button>
            </div>
            <div className="progress"><div style={{ width: `${uploadProgress}%` }} /></div>
          </div>
          <h4 id="cadet-files" className="mt-4 font-medium">File Status</h4>
          {files.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Submitted At</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => (
                    <tr key={f.id}>
                      <td>{f.filename}</td>
                      <td>{f.fileType}</td>
                      <td><span className={f.status === 'Approved' ? 'badge badge-approved' : f.status === 'Rejected' ? 'badge badge-rejected' : 'badge badge-pending'}>{f.status}</span></td>
                      <td>{f.remark || '-'}</td>
                      <td>{new Date(f.createdAt).toLocaleString()}</td>
                      <td>{f.url ? <a className="text-blue-600 underline" href={f.url} target="_blank" rel="noreferrer">Open</a> : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No files</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Prev</button>
            <button type="button" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Next</button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any) }}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={typeFilter} onChange={(e) => { setPage(1); setTypeFilter(e.target.value as any) }}>
              <option value="All">All Types</option>
              <option value="Excuse">Excuse</option>
              <option value="Medical">Medical</option>
              <option value="Complaint">Complaint</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={sortOrder} onChange={(e) => { setPage(1); setSortOrder(e.target.value as any) }}>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
            <span className="ml-auto text-xs text-gray-600">Showing {Math.min(total, (page - 1) * pageSize + (files.length ? 1 : 0))}-{Math.min(total, page * pageSize)} of {total}</span>
          </div>
        </div>
        <div id="cadet-grades" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconGrades /> Grades</h3>
          {grades ? (
            <div className="mt-2 space-y-1 text-sm">
              <div>Attendance: {grades.attendance}</div>
              <div>Military Aptitude: {grades.militaryAptitude}</div>
              <div>Exams: {grades.exams}</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="animate-pulse h-4 bg-gray-200 rounded w-1/3" />
              <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2" />
              <div className="animate-pulse h-4 bg-gray-200 rounded w-1/4" />
            </div>
          )}
        </div>
        <div id="cadet-messages" className="rounded-lg border bg-white p-4 md:col-span-2">
          <h3 className="card-title flex items-center gap-2"><IconMessage /> Messages <span className="badge">{unreadTotal} unread</span></h3>
          <ul className="mt-2 space-y-2">
            {messages.map((m) => (
              <li key={m.id} className="rounded border p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className={m.read ? 'text-gray-700' : 'font-semibold'}>{m.content}</span>
                  <span className="text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <button type="button" onClick={() => toggleMessageRead(m.id, !m.read)} className={m.read ? 'btn btn-secondary' : 'btn btn-primary'}>
                    {m.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </div>
              </li>
            ))}
            {messages.length === 0 && <li className="text-sm text-gray-600">No messages</li>}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" disabled={msgPage <= 1} onClick={() => setMsgPage((p) => Math.max(1, p - 1))} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Prev</button>
            <button type="button" disabled={msgPage * msgPageSize >= msgTotal} onClick={() => setMsgPage((p) => p + 1)} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Next</button>
            <span className="text-sm text-gray-600">Page {msgPage}</span>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={msgPageSize} onChange={(e) => { setMsgPage(1); setMsgPageSize(Number(e.target.value)) }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={readFilter} onChange={(e) => { setMsgPage(1); setReadFilter(e.target.value as any) }}>
              <option value="All">All</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
            <span className="ml-auto text-xs text-gray-600">Showing {Math.min(msgTotal, (msgPage - 1) * msgPageSize + (messages.length ? 1 : 0))}-{Math.min(msgTotal, msgPage * msgPageSize)} of {msgTotal}</span>
          </div>
          {toast && <div role="status" aria-live="polite" className="fixed right-4 top-4 rounded bg-black/80 px-3 py-2 text-white text-sm">{toast}</div>}
        </div>
      </div>
    </div>
  )
}

function Shell() {
  const { user, token } = useAuth()
  const loc = useLocation()
  const envBase = (import.meta as any).env?.VITE_API_URL
  const apiBase = envBase && !String(envBase).includes('your-api-host.example.com') ? envBase : 'http://localhost:3001'
  const [unread, setUnread] = React.useState(0)
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as any) || 'light')
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  React.useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  React.useEffect(() => {
    if (!token || user?.role !== 'Cadet') return
    const qs = new URLSearchParams({ toRole: 'Cadet', read: 'false', page: '1', pageSize: '1' })
    fetch(`${apiBase}/messages?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { total: 0 }))
      .then((d) => setUnread(Number(d.total || 0)))
  }, [token, user, apiBase])
  const isPublicNoSidebar = !user && (loc.pathname === '/' || loc.pathname === '/login')
  return (
    <div className="min-h-screen">
      <header className="border-b mil-header">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#main" className="skip-link">Skip to main content</a>
          <Link to="/" className="text-xl font-semibold flex items-center gap-2"><IconShield /> MSU-SND ROTC Management System</Link>
          <div className="flex items-center gap-3">
            <button type="button" className="btn btn-outline md:hidden" aria-expanded={mobileMenuOpen} aria-controls="sidebar" onClick={() => setMobileMenuOpen((v) => !v)}>Menu</button>
            {user?.role === 'Cadet' && (
              <span className="inline-flex items-center gap-2">
                <IconBell />
                <span className="badge">{unread} unread</span>
              </span>
            )}
            <button type="button" aria-pressed={theme === 'dark'} title="Toggle color theme" onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} className="btn btn-outline flex items-center gap-2">
              {theme === 'dark' ? <IconSun /> : <IconMoon />} {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            {user && <span className="text-sm">{user.email}</span>}
          </div>
        </div>
      </header>
      {isPublicNoSidebar ? (
        <div className="mx-auto max-w-6xl">
          <main id="main" className="main-panel">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl app-shell">
          {mobileMenuOpen && <div className="sidebar-backdrop md:hidden" onClick={() => setMobileMenuOpen(false)} />}
          <aside id="sidebar" className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
            {!user && (
              <nav>
                <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
              </nav>
            )}
            {user?.role === 'Cadet' && (
              <nav>
                <NavLink to="/cadet" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/cadet?view=upload" onClick={() => setMobileMenuOpen(false)}>Upload File</NavLink>
                <NavLink to="/cadet?view=files" onClick={() => setMobileMenuOpen(false)}>My Files</NavLink>
                <NavLink to="/cadet?view=grades" onClick={() => setMobileMenuOpen(false)}>My Grades</NavLink>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Logout</NavLink>
              </nav>
            )}
            {user?.role === 'Officer' && (
              <nav>
                <NavLink to="/officer" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/officer?view=files" onClick={() => setMobileMenuOpen(false)}>Assigned Cadets</NavLink>
                <NavLink to="/officer?view=files" onClick={() => setMobileMenuOpen(false)}>File Review</NavLink>
                <NavLink to="/officer?view=messages" onClick={() => setMobileMenuOpen(false)}>Messages</NavLink>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Logout</NavLink>
              </nav>
            )}
            {user && (user.role === 'ROTC Coordinator' || user.role === 'NSTP Coordinator') && (
              <nav>
                <NavLink to="/coordinator" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/coordinator?view=files" onClick={() => setMobileMenuOpen(false)}>Cadets</NavLink>
                <NavLink to="/coordinator?view=files" onClick={() => setMobileMenuOpen(false)}>File Submissions</NavLink>
                <NavLink to="/coordinator?view=messages" onClick={() => setMobileMenuOpen(false)}>Messages</NavLink>
                <NavLink to="/coordinator?view=analytics" onClick={() => setMobileMenuOpen(false)}>Analytics</NavLink>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Logout</NavLink>
              </nav>
            )}
            {user?.role === 'Staff' && (
              <nav>
                <NavLink to="/staff" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/staff?view=history" onClick={() => setMobileMenuOpen(false)}>Attendance History</NavLink>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Logout</NavLink>
              </nav>
            )}
            {user?.role === 'System Admin' && (
              <nav>
                <NavLink to="/admin" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/admin?view=users" onClick={() => setMobileMenuOpen(false)}>User Management</NavLink>
                <NavLink to="/admin?view=workflow" onClick={() => setMobileMenuOpen(false)}>Workflow Overview</NavLink>
                <NavLink to="/admin?view=files" onClick={() => setMobileMenuOpen(false)}>File Repository</NavLink>
                <NavLink to="/admin?view=grades" onClick={() => setMobileMenuOpen(false)}>Grades Overview</NavLink>
                <NavLink to="/admin?view=attendance" onClick={() => setMobileMenuOpen(false)}>Attendance Overview</NavLink>
                <NavLink to="/admin?view=logs" onClick={() => setMobileMenuOpen(false)}>System Logs</NavLink>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Logout</NavLink>
              </nav>
            )}
            {user && (user.role === 'Corp Commander' || user.role === 'Commandant') && (
              <nav>
                <NavLink to="/commander" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/commander?view=cadets" onClick={() => setMobileMenuOpen(false)}>Cadets</NavLink>
                <NavLink to="/commander?view=analytics" onClick={() => setMobileMenuOpen(false)}>Analytics</NavLink>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Logout</NavLink>
              </nav>
            )}
          </aside>
          <main id="main" className="main-panel">
            <Routes>
              <Route path="/" element={user ? <Navigate to={
                user.role === 'Cadet' ? '/cadet' :
                user.role === 'Officer' ? '/officer' :
                user.role === 'Staff' ? '/staff' :
                user.role === 'System Admin' ? '/admin' :
                (user.role === 'Corp Commander' || user.role === 'Commandant') ? '/commander' : '/coordinator'
              } replace /> : <Landing />} />
              <Route path="/login" element={user ? <Navigate to={
                user.role === 'Cadet' ? '/cadet' :
                user.role === 'Officer' ? '/officer' :
                user.role === 'Staff' ? '/staff' :
                user.role === 'System Admin' ? '/admin' :
                (user.role === 'Corp Commander' || user.role === 'Commandant') ? '/commander' : '/coordinator'
              } replace /> : <Login />} />
              <Route path="/cadet" element={user?.role === 'Cadet' ? <CadetDashboard /> : <Navigate to="/" replace />} />
              <Route path="/officer" element={user?.role === 'Officer' ? <OfficerDashboard /> : <Navigate to="/" replace />} />
              <Route path="/coordinator" element={user && (user.role === 'ROTC Coordinator' || user.role === 'NSTP Coordinator') ? <CoordinatorDashboard /> : <Navigate to="/" replace />} />
              <Route path="/staff" element={user?.role === 'Staff' ? <StaffDashboard /> : <Navigate to="/" replace />} />
              <Route path="/admin" element={user?.role === 'System Admin' ? <AdminDashboard /> : <Navigate to="/" replace />} />
              <Route path="/commander" element={user && (user.role === 'Corp Commander' || user.role === 'Commandant') ? <CommanderDashboard /> : <Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  )
}

function OfficerDashboard() {
  const { token, user, logout } = useAuth()
  const loc = useLocation()
  const envBase = (import.meta as any).env?.VITE_API_URL
  const apiBase = envBase && !String(envBase).includes('your-api-host.example.com') ? envBase : 'http://localhost:3001'
  const [files, setFiles] = React.useState<any[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All')
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Excuse' | 'Medical' | 'Complaint'>('All')
  const [sortOrder, setSortOrder] = React.useState<'Newest' | 'Oldest'>('Newest')
  const [remark, setRemark] = React.useState<Record<string, string>>({})
  const [toast, setToast] = React.useState('')
  const [inbox, setInbox] = React.useState<any[]>([])
  const [inboxTotal, setInboxTotal] = React.useState(0)
  const [inboxPage, setInboxPage] = React.useState(1)
  const [inboxPageSize, setInboxPageSize] = React.useState(10)
  React.useEffect(() => {
    if (!token) return
    const qs = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      status: statusFilter === 'All' ? '' : statusFilter,
      fileType: typeFilter === 'All' ? '' : typeFilter,
      sort: sortOrder === 'Newest' ? 'desc' : 'asc'
    })
    fetch(`${apiBase}/officer/files?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { items: [], total: 0, page, pageSize }))
      .then((d) => {
        setFiles(d.items ?? [])
        setTotal(d.total ?? 0)
      })
  }, [token, page, pageSize, statusFilter, typeFilter, sortOrder, apiBase])
  React.useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/messages?toRole=Officer&page=${inboxPage}&pageSize=${inboxPageSize}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { items: [], total: 0, page: inboxPage, pageSize: inboxPageSize }))
      .then((d) => {
        setInbox(d.items ?? [])
        setInboxTotal(d.total ?? 0)
      })
  }, [token, inboxPage, inboxPageSize, apiBase])
  React.useEffect(() => {
    const v = new URLSearchParams(loc.search).get('view') || ''
    const id = v === 'files' ? 'officer-files' : v === 'messages' ? 'officer-messages' : ''
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [loc])
  const [modal, setModal] = React.useState<{ id: string; action: 'Approved' | 'Rejected' } | null>(null)
  async function updateStatus(id: string, status: 'Approved' | 'Rejected') {
    if (!token) return
    const res = await fetch(`${apiBase}/officer/files/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, remark: remark[id] || '' })
    })
    if (res.ok) {
      const updated = await res.json()
      setFiles((arr) => arr.map((f) => (f.id === id ? updated : f)))
      setToast(status === 'Approved' ? 'Submission approved' : 'Submission rejected')
      setTimeout(() => setToast(''), 2000)
    }
  }
  async function sendMessage(toRole: string, content: string) {
    if (!token) return
    await fetch(`${apiBase}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ toRole, content })
    })
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-semibold">Officer Dashboard</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <button onClick={logout} className="btn btn-outline flex items-center gap-2"><IconLogout /> Sign out</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div id="officer-files" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconFile /> Assigned Cadet Files</h3>
          <ul className="mt-2 space-y-2">
            {files.map((f) => (
              <li key={f.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">{f.filename} • {f.fileType} • {f.cadetId}</div>
                  <div className="text-sm">{f.status}</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input className="flex-1 rounded border px-2 py-1" placeholder="Remark" value={remark[f.id] || ''} onChange={(e) => setRemark((r) => ({ ...r, [f.id]: e.target.value }))} />
                  <button type="button" onClick={() => setModal({ id: f.id, action: 'Approved' })} className="btn btn-success flex items-center gap-2"><IconCheck /> Approve</button>
                  <button type="button" onClick={() => setModal({ id: f.id, action: 'Rejected' })} className="btn btn-danger flex items-center gap-2"><IconX /> Reject</button>
                </div>
              </li>
            ))}
            {files.length === 0 && <li className="text-sm text-gray-600">No files</li>}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Prev</button>
            <button type="button" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Next</button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any) }}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={typeFilter} onChange={(e) => { setPage(1); setTypeFilter(e.target.value as any) }}>
              <option value="All">All Types</option>
              <option value="Excuse">Excuse</option>
              <option value="Medical">Medical</option>
              <option value="Complaint">Complaint</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={sortOrder} onChange={(e) => { setPage(1); setSortOrder(e.target.value as any) }}>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
            <span className="ml-auto text-xs text-gray-600">Showing {Math.min(total, (page - 1) * pageSize + (files.length ? 1 : 0))}-{Math.min(total, page * pageSize)} of {total}</span>
          </div>
        </div>
        <div id="officer-messages" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconMessage /> Messaging</h3>
          <div className="mt-2 space-y-2">
            <button type="button" onClick={() => sendMessage('Cadet', 'Please update your submission.')} className="btn btn-primary flex items-center gap-2"><IconMessage /> Message Cadets</button>
            <button type="button" onClick={() => sendMessage('Coordinator', 'Monthly summary incoming.')} className="btn btn-secondary flex items-center gap-2"><IconMessage /> Message Coordinators</button>
          </div>
          <h4 className="mt-4 font-medium">Inbox</h4>
          <ul className="mt-2 space-y-2">
            {inbox.map((m) => (
              <li key={m.id} className="rounded border p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{m.content}</span>
                  <span className="text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
              </li>
            ))}
            {inbox.length === 0 && <li className="text-sm text-gray-600">No messages</li>}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" disabled={inboxPage <= 1} onClick={() => setInboxPage((p) => Math.max(1, p - 1))} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Prev</button>
            <button type="button" disabled={inboxPage * inboxPageSize >= inboxTotal} onClick={() => setInboxPage((p) => p + 1)} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Next</button>
            <span className="text-sm text-gray-600">Page {inboxPage}</span>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={inboxPageSize} onChange={(e) => { setInboxPage(1); setInboxPageSize(Number(e.target.value)) }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="ml-auto text-xs text-gray-600">Showing {Math.min(inboxTotal, (inboxPage - 1) * inboxPageSize + (inbox.length ? 1 : 0))}-{Math.min(inboxTotal, inboxPage * inboxPageSize)} of {inboxTotal}</span>
          </div>
        </div>
      </div>
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold">{modal.action} Submission</h4>
            <p className="mt-2 text-sm">Add remarks (optional):</p>
            <textarea className="mt-2 w-full rounded border px-2 py-1" rows={3} value={remark[modal.id] || ''} onChange={(e) => setRemark((r) => ({ ...r, [modal.id]: e.target.value }))} />
            <div className="mt-3 flex items-center gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button type="button" className={modal.action === 'Approved' ? 'btn btn-success' : 'btn btn-danger'} onClick={() => { updateStatus(modal.id, modal.action); setModal(null) }}>
                Confirm {modal.action}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && <div role="status" aria-live="polite" className="fixed right-4 top-4 rounded bg-black/80 px-3 py-2 text-white text-sm">{toast}</div>}
    </div>
  )
}

function CoordinatorDashboard() {
  const { token, user, logout } = useAuth()
  const loc = useLocation()
  const envBase = (import.meta as any).env?.VITE_API_URL
  const apiBase = envBase && !String(envBase).includes('your-api-host.example.com') ? envBase : 'http://localhost:3001'
  const [files, setFiles] = React.useState<any[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All')
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Excuse' | 'Medical' | 'Complaint'>('All')
  const [sortOrder, setSortOrder] = React.useState<'Newest' | 'Oldest'>('Newest')
  const [remark, setRemark] = React.useState<Record<string, string>>({})
  const [toast, setToast] = React.useState('')
  React.useEffect(() => {
    if (!token) return
    const qs = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      status: statusFilter === 'All' ? '' : statusFilter,
      fileType: typeFilter === 'All' ? '' : typeFilter,
      sort: sortOrder === 'Newest' ? 'desc' : 'asc'
    })
    fetch(`${apiBase}/coordinator/files?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { items: [], total: 0, page, pageSize }))
      .then((d) => {
        setFiles(d.items ?? [])
        setTotal(d.total ?? 0)
      })
  }, [token, page, pageSize, statusFilter, typeFilter, sortOrder, apiBase])
  React.useEffect(() => {
    const v = new URLSearchParams(loc.search).get('view') || ''
    const id = v === 'files' ? 'coord-files' : v === 'analytics' ? 'coord-analytics' : v === 'messages' ? 'coord-messages' : ''
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [loc])
  async function updateStatus(id: string, status: 'Approved' | 'Rejected') {
    if (!token) return
    if (status === 'Rejected' && !window.confirm('Reject this submission?')) return
    const res = await fetch(`${apiBase}/coordinator/files/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, remark: remark[id] || '' })
    })
    if (res.ok) {
      const updated = await res.json()
      setFiles((arr) => arr.map((f) => (f.id === id ? updated : f)))
      setToast(status === 'Approved' ? 'Submission approved' : 'Submission rejected')
      setTimeout(() => setToast(''), 2000)
    }
  }
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }
  async function bulk(status: 'Approved' | 'Rejected') {
    const ids = Object.keys(selected).filter((id) => selected[id])
    for (const id of ids) {
      await updateStatus(id, status)
    }
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-semibold">Coordinator Dashboard</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <button onClick={logout} className="btn btn-outline flex items-center gap-2"><IconLogout /> Sign out</button>
      </div>
      <div id="coord-files" className="rounded-lg border bg-white p-4">
        <h3 className="card-title flex items-center gap-2"><IconWorkflow /> File Approval Workflow</h3>
        {files.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Cadet</th>
                  <th>File</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.id}>
                    <td><input type="checkbox" checked={!!selected[f.id]} onChange={() => toggleSelect(f.id)} /></td>
                    <td>{f.cadetId}</td>
                    <td>{f.filename}</td>
                    <td>{f.fileType}</td>
                    <td><span className={f.status === 'Approved' ? 'badge badge-approved' : f.status === 'Rejected' ? 'badge badge-rejected' : 'badge badge-pending'}>{f.status}</span></td>
                    <td><input className="w-full rounded border px-2 py-1" placeholder="Remark" value={remark[f.id] || ''} onChange={(e) => setRemark((r) => ({ ...r, [f.id]: e.target.value }))} /></td>
                    <td className="whitespace-nowrap">
                      <button type="button" onClick={() => updateStatus(f.id, 'Approved')} className="btn btn-success btn-sm">Approve</button>
                      <button type="button" onClick={() => updateStatus(f.id, 'Rejected')} className="btn btn-danger btn-sm ml-1">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No files</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => bulk('Approved')} className="btn btn-success w-full sm:w-auto">Approve selected</button>
          <button type="button" onClick={() => bulk('Rejected')} className="btn btn-danger w-full sm:w-auto">Reject selected</button>
        </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Prev</button>
            <button type="button" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 disabled:opacity-50 w-full sm:w-auto">Next</button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any) }}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={typeFilter} onChange={(e) => { setPage(1); setTypeFilter(e.target.value as any) }}>
              <option value="All">All Types</option>
              <option value="Excuse">Excuse</option>
              <option value="Medical">Medical</option>
              <option value="Complaint">Complaint</option>
            </select>
            <select className="rounded border px-2 py-1 w-full sm:w-auto" value={sortOrder} onChange={(e) => { setPage(1); setSortOrder(e.target.value as any) }}>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
            <span className="ml-auto text-xs text-gray-600">Showing {Math.min(total, (page - 1) * pageSize + (files.length ? 1 : 0))}-{Math.min(total, page * pageSize)} of {total}</span>
          </div>
          {toast && <div role="status" aria-live="polite" className="fixed right-4 top-4 rounded bg-black/80 px-3 py-2 text-white text-sm">{toast}</div>}
      </div>
      <div id="coord-analytics" className="rounded-lg border bg-white p-4 mt-4">
        <h3 className="card-title">Analytics</h3>
        <p className="text-sm text-gray-600">Overview coming soon</p>
      </div>
    </div>
  )
}

function StaffDashboard() {
  const { token, user, logout } = useAuth()
  const loc = useLocation()
  const envBase = (import.meta as any).env?.VITE_API_URL
  const apiBase = envBase && !String(envBase).includes('your-api-host.example.com') ? envBase : 'http://localhost:3001'
  const [logs, setLogs] = React.useState<any[]>([])
  const [qr, setQr] = React.useState('')
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const [videoOn, setVideoOn] = React.useState(false)
  const [scanStatus, setScanStatus] = React.useState<'Idle' | 'Present' | 'Absent'>('Idle')
  React.useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/staff/attendance`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setLogs(d))
  }, [token, apiBase])
  React.useEffect(() => {
    const v = new URLSearchParams(loc.search).get('view') || ''
    const id = v === 'history' ? 'staff-history' : v === 'scanner' ? 'staff-scanner' : ''
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [loc])
  async function toggleCamera() {
    if (videoOn) {
      const v = videoRef.current
      const stream = v?.srcObject as MediaStream | null
      stream?.getTracks().forEach((t) => t.stop())
      if (v) v.srcObject = null
      setVideoOn(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      const v = videoRef.current
      if (v) {
        v.srcObject = stream
        await v.play()
        setVideoOn(true)
      }
    } catch {}
  }
  async function submit() {
    if (!token || !qr) return
    const res = await fetch(`${apiBase}/staff/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ qr })
    })
    if (res.ok) {
      const entry = await res.json()
      setLogs((l) => [entry, ...l])
      setQr('')
      setScanStatus('Present')
      setTimeout(() => setScanStatus('Idle'), 1500)
    }
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-semibold">Staff Attendance</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <button type="button" onClick={logout} className="btn btn-outline flex items-center gap-2"><IconLogout /> Sign out</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div id="staff-scanner" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconQR /> QR Scanner</h3>
          <div className="mt-2 space-y-2">
            <div className="rounded border bg-black p-2">
              <video ref={videoRef} className="video-responsive w-full object-cover" />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-primary" onClick={toggleCamera}>{videoOn ? 'Stop Camera' : 'Start Camera'}</button>
              <span className="ml-auto text-sm">Scan Status: {scanStatus}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">Manual QR entry</p>
          <div className="mt-1 flex gap-2">
            <input className="flex-1 rounded border px-2 py-1" placeholder="QR payload" value={qr} onChange={(e) => setQr(e.target.value)} />
            <button type="button" onClick={submit} className="btn btn-primary flex items-center gap-2"><IconQR /> Log</button>
          </div>
        </div>
        <div id="staff-history" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconQR /> Attendance History</h3>
          <ul className="mt-2 space-y-2">
            {logs.map((e, i) => (
              <li key={i} className="rounded border p-2 text-sm">{e.timestamp} • {e.qr}</li>
            ))}
            {logs.length === 0 && <li className="text-sm text-gray-600">No logs</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { token, user, logout } = useAuth()
  const loc = useLocation()
  const envBase = (import.meta as any).env?.VITE_API_URL
  const apiBase = envBase && !String(envBase).includes('your-api-host.example.com') ? envBase : 'http://localhost:3001'
  const [workflow, setWorkflow] = React.useState<any>(null)
  const [users, setUsers] = React.useState<any[]>([])
  const [form, setForm] = React.useState({ email: '', role: 'Cadet' })
  React.useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/admin/workflow`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setWorkflow(d))
    fetch(`${apiBase}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setUsers(d))
  }, [token, apiBase])
  React.useEffect(() => {
    const v = new URLSearchParams(loc.search).get('view') || ''
    const id = v === 'workflow' ? 'admin-workflow' : v === 'users' ? 'admin-users' : ''
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [loc])
  async function setRole() {
    if (!token) return
    const res = await fetch(`${apiBase}/admin/users/set-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const u = await res.json()
      setUsers((arr) => {
        const idx = arr.findIndex((x) => x.email === u.email)
        if (idx >= 0) { const copy = [...arr]; copy[idx] = u; return copy }
        return [u, ...arr]
      })
    }
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <button type="button" onClick={logout} className="btn btn-outline flex items-center gap-2"><IconLogout /> Sign out</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div id="admin-workflow" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconWorkflow /> Workflow Overview</h3>
          {workflow ? (
            <div className="mt-2 space-y-1 text-sm">
              <div>Pending: {workflow.pending}</div>
              <div>Approved: {workflow.approved}</div>
              <div>Rejected: {workflow.rejected}</div>
              <div>Messages: {workflow.messages}</div>
              <div>Users: {workflow.users}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Loading...</p>
          )}
        </div>
        <div id="admin-users" className="rounded-lg border bg-white p-4">
          <h3 className="card-title flex items-center gap-2"><IconUser /> User Management</h3>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 rounded border px-2 py-1" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <select className="rounded border px-2 py-1" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option>Cadet</option><option>Officer</option><option>Staff</option><option>ROTC Coordinator</option><option>NSTP Coordinator</option><option>Corp Commander</option><option>Commandant</option><option>System Admin</option>
            </select>
            <button type="button" onClick={setRole} className="btn btn-primary flex items-center gap-2"><IconUser /> Set Role</button>
          </div>
          <ul className="mt-3 space-y-1">
            {users.map((u) => <li key={u.email} className="text-sm">{u.email} • {u.role}</li>)}
            {users.length === 0 && <li className="text-sm text-gray-600">No users</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

function CommanderDashboard() {
  const { token, user, logout } = useAuth()
  const loc = useLocation()
  const envBase = (import.meta as any).env?.VITE_API_URL
  const apiBase = envBase && !String(envBase).includes('your-api-host.example.com') ? envBase : 'http://localhost:3001'
  const [analytics, setAnalytics] = React.useState<any>(null)
  React.useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/analytics`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setAnalytics(d))
  }, [token, apiBase])
  React.useEffect(() => {
    const v = new URLSearchParams(loc.search).get('view') || ''
    const id = v === 'analytics' ? 'commander-analytics' : ''
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [loc])
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-semibold">Commander Analytics</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <button type="button" onClick={logout} className="btn btn-outline flex items-center gap-2"><IconLogout /> Sign out</button>
      </div>
      <div id="commander-analytics" className="rounded-lg border bg-white p-4">
        {analytics ? (
          <div className="space-y-2 text-sm">
            <div className="font-medium">Submissions</div>
            <ul className="list-disc pl-5">
              {analytics.submissions.map((s: any) => <li key={s.type}>{s.type}: {s.count}</li>)}
            </ul>
            <div className="font-medium">Grade Averages</div>
            <ul className="list-disc pl-5">
              <li>Attendance: {analytics.averages.attendance}</li>
              <li>Military Aptitude: {analytics.averages.militaryAptitude}</li>
              <li>Exams: {analytics.averages.exams}</li>
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  )
}
