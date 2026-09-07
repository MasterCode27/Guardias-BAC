/* Guardias Cloud API
   The UI works in local/demo mode until API_BASE is configured.
   Production data that must be shared between phones belongs in the API/database:
   users, rotation settings, rotation order, and notification preferences.
*/
const GuardiasAPI={
  API_BASE: localStorage.getItem('guardiasApiBase') || '',
  configured(){return Boolean(this.API_BASE)},
  setBase(url){this.API_BASE=String(url||'').replace(/\/$/,'');if(this.API_BASE)localStorage.setItem('guardiasApiBase',this.API_BASE);else localStorage.removeItem('guardiasApiBase')},
  async request(path,options={}){
    if(!this.configured()) throw new Error('API_BASE_NOT_CONFIGURED');
    const response=await fetch(this.API_BASE+path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
    if(!response.ok) throw new Error(`API_${response.status}`);
    return response.status===204?null:response.json();
  },
  // Authentication: validates network username + ID number and returns the canonical user record.
  login:(network,password)=>GuardiasAPI.request('/auth/login',{method:'POST',body:JSON.stringify({network,password})}),
  // Bootstrap is the preferred first request after login. It keeps every device synchronized.
  getBootstrap:()=>GuardiasAPI.request('/bootstrap'),
  getPeople:()=>GuardiasAPI.request('/people'),
  createPerson:payload=>GuardiasAPI.request('/people',{method:'POST',body:JSON.stringify(payload)}),
  updatePerson:(id,payload)=>GuardiasAPI.request(`/people/${encodeURIComponent(id)}`,{method:'PUT',body:JSON.stringify(payload)}),
  getRotation:()=>GuardiasAPI.request('/rotation'),
  saveRotation:payload=>GuardiasAPI.request('/rotation',{method:'PUT',body:JSON.stringify(payload)}),
  getNotifications:()=>GuardiasAPI.request('/notifications'),
  saveNotification:payload=>GuardiasAPI.request('/notifications',{method:'PUT',body:JSON.stringify(payload)}),
  forgotPassword:email=>GuardiasAPI.request('/auth/forgot-password',{method:'POST',body:JSON.stringify({email})}),
  resetPassword:(email,code,password)=>GuardiasAPI.request('/auth/reset-password',{method:'POST',body:JSON.stringify({email,code,password})})
};

/*
Expected API contract (backend to be created next):
GET  /bootstrap -> { user, people, rotation }
POST /auth/login -> { user }
GET  /people -> [ { id, name, network, role, active } ]
POST /people -> created user
PUT  /people/:id -> updated user
GET  /rotation -> { startDate, startPersonId, order[] }
PUT  /rotation -> saves the authoritative rotation configuration
GET/PUT /notifications -> per-user notification settings

Important: the browser should never calculate a shared source of truth from localStorage.
localStorage is only a cache/session fallback. The database/API becomes authoritative so a
new user, a renamed user, a changed rotation start date, or a changed order is visible on
all phones and computers after the next sync.
*/
