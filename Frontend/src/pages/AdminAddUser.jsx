import { useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminAddUser(){
  const { token } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', password:'', address:'', role:'store' })
  const [msg, setMsg] = useState('')

  const onChange = (e)=> setForm(f=>({...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e)=>{
    e.preventDefault(); setMsg('')
    try{
      const resp = await api.adminAddUser(token, form)
      if(resp?.status === 'success' || resp === null){
        setMsg('New user created')
      }else{
        setMsg(resp?.message || 'Unable to create user')
      }
    }catch(err){ setMsg(String(err.message||err)) }
  }

  return (
    <div className="card">
      <h2>Add User by Role</h2>
      <form onSubmit={onSubmit} className="grid">
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="password" type="password" placeholder="Temp Password" value={form.password} onChange={onChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={onChange} />
        <select name="role" value={form.role} onChange={onChange}>
          <option value="store">store</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit">Create</button>
        {msg && <p className="muted">{msg}</p>}
      </form>
    </div>
  )
}
