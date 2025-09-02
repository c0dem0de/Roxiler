import { useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function UserResetPassword(){
  const { token } = useAuth()
  const [form, setForm] = useState({ old_password:'', new_password:'', repeat_password:'' })
  const [msg, setMsg] = useState('')

  const onChange = (e)=> setForm(f=>({...f, [e.target.name]:e.target.value}))

  const onSubmit = async (e)=>{
    e.preventDefault(); setMsg('')
    try{
      const resp = await api.userResetPassword(token, form)
      setMsg(resp?.status || 'ok')
    }catch(err){ setMsg(String(err.message||err)) }
  }

  return (
    <div className="card" style={{maxWidth:480}}>
      <h2>Reset Password (User)</h2>
      <form onSubmit={onSubmit} className="grid">
        <input name="old_password" placeholder="Old password" value={form.old_password} onChange={onChange} />
        <input name="new_password" placeholder="New password" value={form.new_password} onChange={onChange} />
        <input name="repeat_password" placeholder="Repeat new password" value={form.repeat_password} onChange={onChange} />
        <button type="submit">Reset</button>
        {msg && <p className="muted">{msg}</p>}
      </form>
    </div>
  )
}
