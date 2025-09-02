import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'

const AuthCtx = createContext(null)

export function AuthProvider({children}){
  const [token, setToken] = useState(()=>localStorage.getItem('token') || '')
  const [role, setRole]   = useState(()=>localStorage.getItem('role') || '')
  const navigate = useNavigate()

  useEffect(()=>{
    if(token) localStorage.setItem('token', token); else localStorage.removeItem('token')
    if(role) localStorage.setItem('role', role); else localStorage.removeItem('role')
  }, [token, role])

  const login = async (email, password)=>{
    const resp = await api.login(email, password)
    const access = resp.accessToken || resp.access_token || resp.token || ''
    const r = resp.role || 'user'
    setToken(access); setRole(r)
    const redirectTo = r === 'admin' ? '/admin' : (r === 'store' ? '/store' : '/user/stores')
    navigate(redirectTo, { replace:true })
  }

  const logout = ()=>{
    setToken(''); setRole('')
    navigate('/login')
  }

  const value = useMemo(()=>({ token, role, user: role?{role}:null, login, logout }), [token, role])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = ()=> useContext(AuthCtx)
