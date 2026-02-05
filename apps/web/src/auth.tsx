import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type User = { email: string; role: string } | null
type AuthContextValue = {
  user: User
  token: string | null
  login: (email: string, role: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User>(null)
  const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3002'

  useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => setUser(u))
      .catch(() => setUser(null))
  }, [token, apiBase])

  const login = async (email: string, role: string) => {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('token', data.token)
    setToken(data.token)
    return true
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
