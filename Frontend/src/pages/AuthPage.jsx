import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

export default function AuthPage(){
  const [tab, setTab] = useState('login')
  return (
    <div className="center-full">
      <div style={{width:360}}>
        <div className="card">
          <div className="tabs" role="tablist">
            <div className={'tab '+(tab==='login'?'active':'')} onClick={()=>setTab('login')}>Login</div>
            <div className={'tab '+(tab==='register'?'active':'')} onClick={()=>setTab('register')}>Register</div>
          </div>
          {tab==='login' ? <LoginForm /> : <RegisterForm onRegistered={()=>setTab('login')} />}
        </div>
      </div>
    </div>
  )
}

function LoginForm(){
  const { login } = useAuth()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  const submitting = async (e)=>{
    e.preventDefault(); setErr('')
    try{ await login(email,password) } catch(e){ setErr(String(e.message || e)) }
  }
  return (
    <form onSubmit={submitting} className="grid">
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <label className="muted" style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" /> Remember</label>
        <a className="muted" href="#" onClick={(e)=>e.preventDefault()}>Forgot?</a>
      </div>
      <button type="submit">Login</button>
      {err && <div style={{color:'crimson'}}>{err}</div>}
    </form>
  )
}

function RegisterForm({onRegistered}){
  const [form,setForm] = useState({ name:'', email:'', password:'', address:'' })
  const [msg,setMsg] = useState('')
  const onChange = (e)=> setForm(f=>({...f, [e.target.name]: e.target.value }))
  const submit = async(e)=>{
    e.preventDefault(); setMsg('')
    try{
      const resp = await api.register(form)
      setMsg('Registered — you can now login')
      if(onRegistered) onRegistered()
    }catch(err){ setMsg(String(err.message || err)) }
  }
  return (
    <form onSubmit={submit} className="grid">
      <input name="name" placeholder="Full name" value={form.name} onChange={onChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={onChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={onChange} />
      <button type="submit">Create account</button>
      {msg && <div className="muted">{msg}</div>}
    </form>
  )
}
