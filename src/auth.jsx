import {createContext,useContext,useEffect,useState} from 'react';
import {cloud,auth,googleProvider} from './firebase.js';
import {onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,signOut,updateProfile} from 'firebase/auth';

const Ctx=createContext();
const MSG={'auth/invalid-credential':'Incorrect email or password.','auth/wrong-password':'Incorrect email or password.','auth/user-not-found':'Incorrect email or password.','auth/email-already-in-use':'That email already has an account.','auth/weak-password':'Password must be at least 6 characters.','auth/invalid-email':'Enter a valid email address.','auth/popup-closed-by-user':'Sign-in was cancelled.','auth/too-many-requests':'Too many attempts. Try again later.','auth/network-request-failed':'Network error. Check your connection.'};
const friendly=e=>new Error(MSG[e.code]||e.message||'Something went wrong');
// Demo mode only: accounts live in this browser. Not secure, for development without Firebase.
const hash=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const accts=()=>{try{return JSON.parse(localStorage.getItem('climafit:accounts')||'{}')}catch{return {}}};

export function AuthProvider({children}){
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[guest,setGuestState]=useState(()=>localStorage.getItem('climafit:guest')==='1');
  const setGuest=v=>{setGuestState(v);v?localStorage.setItem('climafit:guest','1'):localStorage.removeItem('climafit:guest')};
  useEffect(()=>{
    if(cloud)return onAuthStateChanged(auth,u=>{setUser(u?{uid:u.uid,email:u.email,name:u.displayName||(u.email||'').split('@')[0]}:null);setLoading(false)});
    try{setUser(JSON.parse(localStorage.getItem('climafit:session')||'null'))}catch{}
    setLoading(false);
  },[]);
  const startDemo=u=>{localStorage.setItem('climafit:session',JSON.stringify(u));setUser(u);setGuest(false)};
  const api={user,guest,loading,cloud,
    async signUp(name,email,pw){
      email=email.trim().toLowerCase();name=name.trim()||email.split('@')[0];
      try{
        if(cloud){const c=await createUserWithEmailAndPassword(auth,email,pw);await updateProfile(c.user,{displayName:name});setUser({uid:c.user.uid,email,name});setGuest(false);return}
        if(pw.length<6)throw new Error('Password must be at least 6 characters.');
        const a=accts();if(a[email])throw new Error('That email already has an account.');
        const uid='u'+Date.now();a[email]={uid,name,hash:await hash(pw)};localStorage.setItem('climafit:accounts',JSON.stringify(a));startDemo({uid,email,name});
      }catch(e){throw e.code?friendly(e):e}
    },
    async signIn(email,pw){
      email=email.trim().toLowerCase();
      try{
        if(cloud){await signInWithEmailAndPassword(auth,email,pw);setGuest(false);return}
        const r=accts()[email];if(!r||r.hash!==await hash(pw))throw new Error('Incorrect email or password.');
        startDemo({uid:r.uid,email,name:r.name});
      }catch(e){throw e.code?friendly(e):e}
    },
    async google(){try{await signInWithPopup(auth,googleProvider);setGuest(false)}catch(e){throw friendly(e)}},
    continueAsGuest(){setGuest(true)},
    async logout(){if(cloud&&auth.currentUser)await signOut(auth);localStorage.removeItem('climafit:session');setUser(null);setGuest(false)},
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export const useAuth=()=>useContext(Ctx);
