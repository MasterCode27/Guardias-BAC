import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||8080);
const ORIGIN=process.env.APP_ORIGIN||'*';
const BREVO_API_KEY=process.env.BREVO_API_KEY||'';
const SENDER_EMAIL=process.env.BREVO_SENDER_EMAIL||'';
const SENDER_NAME=process.env.BREVO_SENDER_NAME||'Guardias Cloud';
const USERS_FILE=path.join(__dirname,'users.json');
const resetCodes=new Map();

async function readUsers(){return JSON.parse(await fs.readFile(USERS_FILE,'utf8'));}
async function writeUsers(users){await fs.writeFile(USERS_FILE,JSON.stringify(users,null,2));}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS'});res.end(JSON.stringify(data));}
async function body(req){let raw='';for await(const chunk of req)raw+=chunk;return raw?JSON.parse(raw):{};}
function publicUser(u){return {id:u.id,name:u.name,network:u.network,admin:!!u.admin,email:u.email};}
function makeCode(){return String(crypto.randomInt(100000,1000000));}
async function sendEmail(to,name,code){
  if(!BREVO_API_KEY||!SENDER_EMAIL)throw new Error('BREVO_NOT_CONFIGURED');
  const response=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'accept':'application/json','api-key':BREVO_API_KEY,'content-type':'application/json'},body:JSON.stringify({sender:{name:SENDER_NAME,email:SENDER_EMAIL},to:[{email:to,name:name||''}],subject:'Código para recuperar tu contraseña · Guardias',textContent:`Tu código de recuperación de Guardias es ${code}. Expira en 10 minutos. Si no solicitaste este cambio, ignora este correo.`,htmlContent:`<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>Guardias Cloud</h2><p>Recibimos una solicitud para cambiar tu contraseña.</p><div style="font-size:32px;font-weight:800;letter-spacing:8px;padding:18px;background:#f3f4f8;border-radius:12px;text-align:center">${code}</div><p>Este código vence en <b>10 minutos</b> y solo puede utilizarse una vez.</p><p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p></div>`})});
  if(!response.ok)throw new Error(`BREVO_${response.status}`);
}

const server=http.createServer(async(req,res)=>{
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS'});return res.end();}
  try{

    if(req.method==='GET'&&req.url==='/people'){
      const users=await readUsers();return json(res,200,users.map(publicUser));
    }
    if(req.method==='POST'&&req.url==='/people'){
      const payload=await body(req);const users=await readUsers();
      if(!payload.name||!payload.network)return json(res,400,{error:'INVALID_PERSON'});
      if(users.some(x=>x.network.toLowerCase()===String(payload.network).toLowerCase()))return json(res,409,{error:'PERSON_EXISTS'});
      const u={id:String(payload.id||`u-${Date.now()}`),name:String(payload.name),network:String(payload.network).trim().toLowerCase(),admin:!!payload.admin,email:String(payload.email||''),password:String(payload.password||'')};
      users.push(u);await writeUsers(users);return json(res,201,{user:publicUser(u)});
    }
    if(req.method==='PUT'&&req.url.startsWith('/people/')){
      const key=decodeURIComponent(req.url.slice('/people/'.length));const payload=await body(req);const users=await readUsers();const u=users.find(x=>x.network.toLowerCase()===key.toLowerCase());
      if(!u)return json(res,404,{error:'NOT_FOUND'});
      if(payload.network&&users.some(x=>x!==u&&(x.network.toLowerCase()===String(payload.network).toLowerCase())))return json(res,409,{error:'PERSON_EXISTS'});
      if(payload.name!==undefined)u.name=String(payload.name);if(payload.network!==undefined)u.network=String(payload.network).trim().toLowerCase();if(payload.email!==undefined)u.email=String(payload.email).trim().toLowerCase();if(payload.password!==undefined)u.password=String(payload.password);if(payload.admin!==undefined)u.admin=!!payload.admin;
      await writeUsers(users);return json(res,200,{user:publicUser(u)});
    }
    if(req.method==='DELETE'&&req.url.startsWith('/people/')){
      const key=decodeURIComponent(req.url.slice('/people/'.length));const users=await readUsers();const i=users.findIndex(x=>x.network.toLowerCase()===key.toLowerCase());
      if(i<0)return json(res,404,{error:'NOT_FOUND'});if(users.length<=1)return json(res,400,{error:'LAST_MEMBER'});users.splice(i,1);await writeUsers(users);return json(res,200,{ok:true});
    }

    if(req.method==='POST'&&req.url==='/auth/login'){
      const {network,password}=await body(req);const users=await readUsers();const u=users.find(x=>x.network.toLowerCase()===String(network||'').toLowerCase()&&x.password===String(password||''));
      if(!u)return json(res,401,{error:'INVALID_LOGIN'});return json(res,200,{user:publicUser(u)});
    }
    if(req.method==='POST'&&req.url==='/auth/forgot-password'){
      const {email}=await body(req);const users=await readUsers();const u=users.find(x=>x.email.toLowerCase()===String(email||'').trim().toLowerCase());
      if(!u)return json(res,404,{error:'EMAIL_NOT_FOUND'});
      const code=makeCode();resetCodes.set(u.network,{hash:crypto.createHash('sha256').update(code).digest('hex'),expires:Date.now()+10*60*1000});
      await sendEmail(u.email,u.name,code);
      return json(res,200,{ok:true});
    }
    if(req.method==='POST'&&req.url==='/auth/reset-password'){
      const {email,code,password}=await body(req);const users=await readUsers();const u=users.find(x=>x.email.toLowerCase()===String(email||'').trim().toLowerCase());
      if(!u)return json(res,400,{error:'INVALID_CODE'});const saved=resetCodes.get(u.network);const hash=crypto.createHash('sha256').update(String(code||'')).digest('hex');
      if(!saved||saved.expires<Date.now()||saved.hash!==hash)return json(res,400,{error:'INVALID_CODE'});
      if(String(password||'').length<8)return json(res,400,{error:'WEAK_PASSWORD'});
      u.password=String(password);await writeUsers(users);resetCodes.delete(u.network);return json(res,200,{ok:true});
    }
    return json(res,404,{error:'NOT_FOUND'});
  }catch(error){console.error(error);return json(res,500,{error:'SERVER_ERROR'});}
});
server.listen(PORT,()=>console.log(`Guardias API listening on http://localhost:${PORT}`));
