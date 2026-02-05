import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type User = { email: string; role: string } | null
type AuthContextValue = {
  user: User
  token: string | null
  login: (email: string, role: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User>(null)
  const [apiBase, setApiBase] = useState<string>(() => {
    const envBase = (import.meta as any).env?.VITE_API_URL
    const cached = localStorage.getItem('apiBase') || ''
    const usableEnv = envBase && !String(envBase).includes('your-api-host.example.com') ? String(envBase) : ''
    return usableEnv || cached || 'http://localhost:3001'
  })
  useEffect(() => {
    let cancelled = false
    async function probe() {
      const candidates = [apiBase, 'http://localhost:3001', 'http://localhost:3005'].filter((v, i, arr) => v && arr.indexOf(v) === i)
      for (const base of candidates) {
        try {
          const ctrl = new AbortController()
          const t = setTimeout(() => ctrl.abort(), 1200)
          const res = await fetch(`${base}/health`, { signal: ctrl.signal })
          clearTimeout(t)
          if (res.ok) {
            if (!cancelled) {
              setApiBase(base)
              localStorage.setItem('apiBase', base)
            }
            break
          }
        } catch {}
      }
    }
    probe()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => setUser(u))
      .catch(() => setUser(null))
  }, [token, apiBase])

  const login = async (email: string, role: string) => {
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return { ok: false, error: 'Please enter a valid email' }
    }
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    })
    if (!res.ok) {
      let msg = 'Login failed'
      try {
        const err = await res.json()
        if (typeof err?.error === 'string') msg = err.error
        if (res.status === 403 && role === 'System Admin') msg = 'This email is not authorized for System Admin'
      } catch {}
      return { ok: false, error: msg }
    }
    const data = await res.json()
    localStorage.setItem('token', data.token)
    setToken(data.token)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthProvider missing')
  return ctx
}
