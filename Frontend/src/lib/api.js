const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getHeaders(token, isJSON = true){
  const h = {}
  if(isJSON) h['Content-Type'] = 'application/json'
  if(token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function handle(res){
  if(!res.ok){
    let text = await res.text()
    try{ const json = JSON.parse(text); throw new Error(json.message || JSON.stringify(json)) }
    catch { throw new Error(text || res.statusText) }
  }
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export const api = {
  login: (email, password) =>
    fetch(`${baseURL}/auth/login`, { method:'POST', headers:getHeaders(), body: JSON.stringify({email, password})}).then(handle),
  register: (payload) =>
    fetch(`${baseURL}/auth/register`, { method:'POST', headers:getHeaders(), body: JSON.stringify(payload)}).then(handle),

  adminDashboard: (token) =>
    fetch(`${baseURL}/admin/dashboard`, { headers:getHeaders(token) }).then(handle),
  adminStores: (token) =>
    fetch(`${baseURL}/admin/stores`, { headers:getHeaders(token) }).then(handle),
  adminUsers: (token, params={}) => {
    const q = new URLSearchParams(params).toString()
    return fetch(`${baseURL}/admin/users${q?`?${q}`:''}`, { headers:getHeaders(token) }).then(handle)
  },
  adminAddUser: (token, payload) =>
    fetch(`${baseURL}/admin/adduser`, { method:'POST', headers:getHeaders(token), body: JSON.stringify(payload)}).then(handle),

  storeAvg: (token) =>
    fetch(`${baseURL}/store/ratings/average`, { headers:getHeaders(token) }).then(handle),
  storeRaters: (token) =>
    fetch(`${baseURL}/store/ratings/users`, { headers:getHeaders(token) }).then(handle),
  storeResetPassword: (token, payload) =>
    fetch(`${baseURL}/store/resetpassword`, { method:'POST', headers:getHeaders(token), body: JSON.stringify(payload)}).then(handle),

  userStores: (token, q) => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : ''
    return fetch(`${baseURL}/user/stores${qs}`, { headers:getHeaders(token) }).then(handle)
  },
  userResetPassword: (token, payload) =>
    fetch(`${baseURL}/user/resetpassword`, { method:'POST', headers:getHeaders(token), body: JSON.stringify(payload)}).then(handle),
  userRate: (token, storeId, score, method='POST') =>
    fetch(`${baseURL}/user/rate/${storeId}`, { method, headers:getHeaders(token), body: JSON.stringify({score})}).then(handle),
}
