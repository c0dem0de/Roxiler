import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function AdminDashboard(){
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState('')

  useEffect(()=>{
    api.adminDashboard(token).then(setStats).catch(e=>setErr(String(e.message||e)))
  }, [token])

  return (
    <div className="grid">
      <div className="card">
        <h2>Admin Dashboard</h2>
        {err && <p style={{color:'crimson'}}>{err}</p>}
        {stats ? (
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginTop:12}}>
            <Stat title="Users" value={stats.totalUsers} />
            <Stat title="Stores" value={stats.totalStores} />
            <Stat title="Ratings" value={stats.totalRatings} />
          </div>
        ) : <p className="muted">Loading…</p>}
        <div style={{display:'flex',gap:10,marginTop:14}}>
          <Link to="/admin/stores" className="pill">View Stores</Link>
          <Link to="/admin/users" className="pill">View Users</Link>
          <Link to="/admin/adduser" className="pill">Add User</Link>
        </div>
      </div>
    </div>
  )
}

function Stat({title,value}){
  return <div className="card"><h4 className="muted" style={{margin:0}}>{title}</h4><p style={{fontSize:28, margin:0, marginTop:8}}>{value}</p></div>
}
