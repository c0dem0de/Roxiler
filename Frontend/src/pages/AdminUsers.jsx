import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminUsers(){
  const { token } = useAuth()
  const [q, setQ] = useState({ name:'', email:'', address:'', role:'' })
  const [users, setUsers] = useState([])
  const [err, setErr] = useState('')

  const fetchUsers = ()=> api.adminUsers(token, Object.fromEntries(Object.entries(q).filter(([_,v])=>v))).then(setUsers).catch(e=>setErr(String(e.message||e)))

  useEffect(()=>{ fetchUsers() }, [])

  return (
    <div className="card">
      <h2>Users</h2>
      <div className="grid">
        <div className="grid grid-2">
          <input placeholder="name" value={q.name} onChange={e=>setQ(q=>({...q, name:e.target.value}))} />
          <input placeholder="email" value={q.email} onChange={e=>setQ(q=>({...q, email:e.target.value}))} />
          <input placeholder="address" value={q.address} onChange={e=>setQ(q=>({...q, address:e.target.value}))} />
          <select value={q.role} onChange={e=>setQ(q=>({...q, role:e.target.value}))}>
            <option value="">role: any</option>
            <option value="admin">admin</option>
            <option value="store">store</option>
            <option value="user">user</option>
          </select>
        </div>
        <div><button onClick={fetchUsers}>Search</button></div>
      </div>
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <table style={{marginTop:12}}>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>{users.map(u=>(<tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>))}</tbody>
      </table>
    </div>
  )
}
