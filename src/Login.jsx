import {useState} from 'react';
import {motion} from 'framer-motion';
import {Loader2} from 'lucide-react';
import {useAuth} from './auth.jsx';
import Avatar from './Avatar.jsx';
import {DEFAULT} from './engine.js';
import {DEF} from './look.js';

const input='w-full rounded-full border border-forest/20 bg-white/70 px-5 py-3 outline-none focus:border-forest focus:ring-2 focus:ring-sage/60 text-forest placeholder:text-forest/40';
export default function Login(){
  const A=useAuth();const [mode,setMode]=useState('in'),[name,setName]=useState(''),[email,setEmail]=useState(''),[pw,setPw]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  const run=async fn=>{setErr('');setBusy(true);try{await fn()}catch(x){setErr(x.message)}setBusy(false)};
  const submit=e=>{e.preventDefault();run(()=>mode==='in'?A.signIn(email,pw):A.signUp(name,email,pw))};
  return <div className="min-h-screen grid md:grid-cols-2 bg-cream text-forest font-sans">
    <div className="hidden md:flex flex-col justify-between bg-forest text-cream p-12 relative overflow-hidden">
      <span className="font-serif text-3xl">ClimaFit</span>
      <div className="relative z-10"><h1 className="font-serif text-5xl leading-tight">Dress for the day<br/>you’re actually having.</h1><p className="mt-4 opacity-80 max-w-sm">Live weather, outfit ideas that make sense, and an avatar to try them on.</p></div>
      <div className="absolute right-[-40px] bottom-[-20px] w-72 h-72 rounded-full bg-sage/40"/><div className="absolute right-10 bottom-0 w-56"><Avatar o={DEFAULT} a={DEF} className="w-full"/></div>
    </div>
    <div className="flex items-center justify-center p-6"><motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
      <h2 className="font-serif text-4xl mb-1">{mode==='in'?'Welcome back':'Create your account'}</h2>
      <p className="opacity-70 mb-6">{mode==='in'?'Sign in to open your wardrobe and avatar.':'Save your avatar, wardrobe and favourites.'}</p>
      <div className="flex gap-1 rounded-full bg-sage/25 p-1 mb-5">{[['in','Sign in'],['up','Sign up']].map(([m,l])=><button key={m} onClick={()=>{setMode(m);setErr('')}} className={'flex-1 rounded-full py-2 text-sm transition '+(mode===m?'bg-forest text-cream':'')}>{l}</button>)}</div>
      <form onSubmit={submit} className="space-y-3">
        {mode==='up'&&<input className={input} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/>}
        <input className={input} type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
        <input className={input} type="password" required minLength={6} placeholder="Password (6+ characters)" value={pw} onChange={e=>setPw(e.target.value)} autoComplete={mode==='in'?'current-password':'new-password'}/>
        {err&&<p role="alert" className="text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="w-full rounded-full bg-forest text-cream py-3 font-medium hover:-translate-y-0.5 transition disabled:opacity-60">{busy?<Loader2 className="animate-spin inline" size={18}/>:mode==='in'?'Sign in':'Create account'}</button>
      </form>
      {A.cloud&&<button onClick={()=>run(A.google)} disabled={busy} className="w-full mt-3 rounded-full border border-forest/30 py-3 hover:bg-sage/30 transition">Continue with Google</button>}
      <button onClick={A.continueAsGuest} className="block mx-auto mt-5 text-sm underline opacity-70">Continue as guest</button>
      {!A.cloud&&<p className="text-xs opacity-60 mt-6 text-center">Demo mode: accounts are stored only on this device. Add Firebase keys in .env to enable cloud accounts.</p>}
    </motion.div></div></div>;
}
