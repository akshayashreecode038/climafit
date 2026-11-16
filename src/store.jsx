import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {doc,getDoc,setDoc} from 'firebase/firestore';
import {DEF} from './look.js';
import {cloud,db} from './firebase.js';

const Ctx=createContext();
const init={city:null,weather:null,style:'Casual',seed:0,outfit:null,auto:true,appearance:DEF,onboarded:false,view:'2D',units:'C',dark:false,favorites:[],wardrobe:[]};
const SYNC=['style','seed','outfit','auto','appearance','units','dark','onboarded','view','favorites','wardrobe','city'];
const clean=s=>JSON.parse(JSON.stringify(Object.fromEntries(SYNC.map(k=>[k,s[k]]))));
const merge=x=>({...init,...x,appearance:{...DEF,...x.appearance}});
const load=key=>{try{return merge(JSON.parse(localStorage.getItem(key)||(key.endsWith('guest')&&localStorage.getItem('climafit'))||'{}'))}catch{return merge({})}};

// Remounted per user (see main.jsx), so each account gets its own state.
export function Provider({uid,children}){
  const key='climafit:'+(uid||'guest'),sync=cloud&&uid;
  const [s,set]=useState(()=>load(key)),ready=useRef(!sync);
  useEffect(()=>{
    if(!sync)return;
    getDoc(doc(db,'users',uid)).then(d=>{if(d.exists())set(x=>merge({...x,...d.data()}));ready.current=true;set(x=>({...x}))}).catch(()=>{});
  },[]);
  useEffect(()=>{
    try{localStorage.setItem(key,JSON.stringify(s))}catch{}
    if(!sync||!ready.current)return;
    const t=setTimeout(()=>setDoc(doc(db,'users',uid),clean(s),{merge:true}).catch(()=>{}),1200);
    return()=>clearTimeout(t);
  },[s]);
  const up=p=>set(x=>({...x,...(typeof p==='function'?p(x):p)}));
  const reset=()=>set(x=>({...init,weather:x.weather,city:x.city}));
  return <Ctx.Provider value={{s,up,reset}}>{children}</Ctx.Provider>;
}
export const useStore=()=>useContext(Ctx);
