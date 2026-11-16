import {useState,useEffect,useRef,lazy,Suspense} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {useAuth} from './auth.jsx';
import {useNavigate,Link} from 'react-router-dom';
import {Search,MapPin,Droplets,Wind,Sunrise,Sunset,Umbrella,Heart,Trash2,AlertTriangle,Loader2,Sun,Cloud,CloudSun,CloudRain,CloudSnow,CloudLightning,CloudFog} from 'lucide-react';
import {useStore} from './store.jsx';
import {geocode,getWeather,T} from './weather.js';
import {recommend,STYLES,OPTS,DEFAULT} from './engine.js';
import Avatar from './Avatar.jsx';
import {SKINS,EYE_COLORS,FACE,BODIES,DEF} from './look.js';
const Avatar3D=lazy(()=>import('./Avatar3D.jsx'));

const cap=x=>x[0].toUpperCase()+x.slice(1);
const Card=({children,className=''})=><div className={'rounded-3xl border border-forest/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5 shadow-sm transition-shadow hover:shadow-md '+className}>{children}</div>;
const H=({children,sub})=><div className="mb-6"><h1 className="font-serif text-4xl md:text-5xl">{children}</h1>{sub&&<p className="opacity-70 mt-2">{sub}</p>}</div>;
const Btn=({children,primary,...p})=><button {...p} className={'rounded-full px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 '+(primary?'bg-forest text-cream dark:bg-sage dark:text-forest':'border border-forest/30 dark:border-white/30 hover:bg-sage/30')+' '+(p.className||'')}>{children}</button>;
const Chip=({on,...p})=><button {...p} className={'rounded-full px-3 py-1 text-sm transition '+(on?'bg-forest text-cream dark:bg-sage dark:text-forest':'bg-sage/25 hover:bg-sage/50')}/>;
const Empty=()=><Card><p className="mb-3">Pick a city on the Weather page first so we can dress you for it.</p><Link to="/"><Btn primary>Go to Weather</Btn></Link></Card>;
const WxIcon=({code,size=48,className=''})=>{const I=code===0?Sun:code<=2?CloudSun:code===3?Cloud:code<=48?CloudFog:code<=67?CloudRain:code<=77?CloudSnow:code<=82?CloudRain:CloudLightning;return <I size={size} className={className} strokeWidth={1.4}/>};
const hm=s=>new Date(s).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const day=s=>new Date(s).toLocaleDateString([], {weekday:'short'});

export function WeatherPage(){
  const {s,up}=useStore();const nav=useNavigate();const fetched=useRef('');const [q,setQ]=useState('');const [err,setErr]=useState('');const [load,setLoad]=useState(false);
  const run=async fn=>{setLoad(true);setErr('');try{const city=await fn();fetched.current=city.name;up({city,weather:await getWeather(city)})}catch(e){setErr(e.message||'Something went wrong')}setLoad(false)};
  useEffect(()=>{if(s.city&&fetched.current!==s.city.name)run(async()=>s.city)},[s.city?.name]);
  const locate=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>run(async()=>({name:'Current location',lat:p.coords.latitude,lon:p.coords.longitude})),()=>setErr('Location permission was denied.')):setErr('Geolocation is not supported.');
  const w=s.weather,u=s.units;
  return <div>
    <H sub="Search a city and get dressed for the day.">Weather, <i>worn well.</i></H>
    <form onSubmit={e=>{e.preventDefault();q.trim()&&run(()=>geocode(q.trim()))}} className="flex gap-2 mb-6 flex-wrap">
      <div className="flex-1 min-w-[220px] flex items-center gap-2 rounded-full border border-forest/20 bg-white/70 dark:bg-white/10 px-4"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search city…" className="bg-transparent outline-none py-2.5 w-full"/></div>
      <Btn primary type="submit">Search</Btn><Btn type="button" onClick={locate}><MapPin size={14} className="inline mr-1"/>Use my location</Btn>
    </form>
    {err&&<Card className="mb-4 border-red-300"><AlertTriangle size={16} className="inline mr-2"/>{err}</Card>}
    {load&&!w&&<div className="grid md:grid-cols-3 gap-4 animate-pulse"><div className="md:col-span-2 h-64 rounded-3xl bg-sage/30"/><div className="h-64 rounded-3xl bg-sage/20"/></div>}{load&&w&&<p className="text-sm opacity-60 mb-2 flex items-center gap-2"><Loader2 className="animate-spin" size={14}/>Updating…</p>}
    {!w&&!load&&<Card>Search for a city or allow location access to begin.</Card>}
    {w&&<>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2"><p className="opacity-70 flex items-center gap-1"><MapPin size={14}/>{s.city?.name}</p>
          <div className="flex items-center gap-4 my-2"><div className="font-serif text-7xl md:text-8xl">{T(w.temp,u)}</div><WxIcon code={w.code} size={72} className="opacity-70"/></div><p className="text-xl">{w.label} · feels like {T(w.feels,u)}</p>
          <Btn primary className="mt-6 !px-8 !py-3 text-base" onClick={()=>{up({outfit:recommend(w,s.style,s.seed),auto:true});nav('/outfit')}}>Get My Outfit</Btn></Card>
        <Card className="grid grid-cols-2 gap-4 content-start">
          {[[Droplets,'Humidity',w.humidity+'%'],[Wind,'Wind',Math.round(w.wind)+' km/h'],[Umbrella,'Rain chance',w.rain+'%'],[Sunrise,'Sunrise',hm(w.sunrise)],[Sunset,'Sunset',hm(w.sunset)]].map(([I,l,v])=>
            <div key={l}><I size={16} className="opacity-60"/><p className="text-xs opacity-60 mt-1">{l}</p><p className="font-semibold">{v}</p></div>)}</Card>
      </div>
      {w.alerts.length>0&&<Card className="mt-4 bg-amber-100/70 dark:bg-amber-200/10"><p className="font-semibold mb-1"><AlertTriangle size={16} className="inline mr-1"/>Weather alerts</p>{w.alerts.map((a,i)=><p key={i} className="text-sm">{day(a.date)}: {a.text}</p>)}</Card>}
      <h2 className="font-serif text-2xl mt-8 mb-3">7-day forecast</h2>
      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">{w.daily.map((d,i)=><motion.div key={d.date} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}><Card className="!p-3 text-center"><p className="text-sm opacity-70">{day(d.date)}</p><WxIcon code={d.code} size={24} className="mx-auto my-1"/><p className="font-semibold">{T(d.max,u)}</p><p className="text-xs opacity-60">{T(d.min,u)}</p><p className="text-xs mt-1">{d.label}</p><p className="text-xs opacity-60">{d.rain}% rain</p></Card></motion.div>)}</div>
    </>}
  </div>;
}

const ICON={top:'👕',bottom:'👖',outer:'🧥',shoes:'👟',acc:'🕶️'};
export function OutfitPage(){
  const {s,up}=useStore();const nav=useNavigate();const [msg,setMsg]=useState('');const w=s.weather;
  if(!w)return <Empty/>;
  const o=recommend(w,s.style,s.seed),alts=STYLES.filter(x=>x!==s.style).slice(0,3).map(x=>recommend(w,x,s.seed+1));
  const rows=[['top','Top',o.top,o.why.top],['bottom','Bottom',o.bottom,o.why.bottom],['outer','Outerwear',o.outer==='none'?'None needed':o.outer,o.why.outer],['shoes','Footwear',o.shoes,o.why.shoes],['acc','Accessories',o.acc.length?o.acc.join(', '):'None needed',o.why.acc]];
  const flash=m=>{setMsg(m);setTimeout(()=>setMsg(''),2000)};
  const tryOn=x=>{up({outfit:x,auto:false});nav('/avatar')};
  return <div>
    <H sub={`${s.city?.name} · ${T(w.temp,s.units)}, ${w.label}, feels like ${T(w.feels,s.units)}`}>Today’s outfit</H>
    <div className="flex flex-wrap gap-2 mb-6">{STYLES.map(x=><Chip key={x} on={s.style===x} onClick={()=>up({style:x})}>{x}</Chip>)}</div>
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="flex justify-center"><Avatar o={o} a={s.appearance} className="h-[420px]"/></Card>
      <div className="space-y-3">
        {rows.map(([k,l,v,why])=><Card key={k} className="!p-4 flex gap-4 items-start"><div className="text-3xl">{ICON[k]}</div><div><p className="text-xs uppercase tracking-wide opacity-60">{l}</p><p className="font-semibold">{cap(v)}</p><p className="text-sm opacity-75">{why}</p></div></Card>)}
        <div className="flex flex-wrap gap-2 pt-2">
          <Btn primary onClick={()=>tryOn(o)}>Try on Avatar</Btn>
          <Btn onClick={()=>{up(x=>({favorites:[...x.favorites,{id:Date.now(),outfit:o,temp:w.temp,label:w.label,city:x.city?.name}]}));flash('Saved to Favorites ♥')}}>Save Outfit</Btn>
          <Btn onClick={()=>up(x=>({seed:x.seed+1}))}>More Suggestions</Btn>
          <Btn onClick={()=>{const C={top:'Tops',bottom:'Bottoms',outer:'Jackets',shoes:'Shoes',acc:'Accessories'};up(x=>({wardrobe:[...x.wardrobe,...rows.filter(r=>!r[2].startsWith('None')).map(r=>({id:Date.now()+Math.random(),name:cap(r[2]),cat:C[r[0]],img:''}))]}));flash('Added to Wardrobe')}}>Add to Wardrobe</Btn>
        </div><AnimatePresence>{msg&&<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} role="status" className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 rounded-full bg-forest text-cream px-5 py-2.5 shadow-lg text-sm">{msg}</motion.div>}</AnimatePresence>
      </div>
    </div>
    <h2 className="font-serif text-2xl mt-10 mb-3">Alternative looks</h2>
    <div className="grid sm:grid-cols-3 gap-4">{alts.map(a=><Card key={a.style} className="text-center"><Avatar o={a} a={s.appearance} className="h-56 mx-auto"/><p className="font-semibold mt-2">{a.style}</p><p className="text-xs opacity-70 mb-3">{cap(a.top)} · {cap(a.bottom)} · {cap(a.shoes)}</p><Btn onClick={()=>up({style:a.style})}>Use this style</Btn></Card>)}</div>
  </div>;
}

const Pick=({label,value,opts,onChange})=><div className="mb-4"><p className="text-xs uppercase tracking-wide opacity-60 mb-1">{label}</p><div className="flex flex-wrap gap-2">{opts.map(x=><Chip key={x} on={value===x} onClick={()=>onChange(x)}>{cap(x)}</Chip>)}</div></div>;
export function AvatarPage(){
  const {s,up}=useStore();const a=s.appearance;
  const o=s.auto&&s.weather?recommend(s.weather,s.style,s.seed):(s.outfit||DEFAULT);
  const set=p=>{const n={...o,...p};n.colors={...o.colors,...(p.colors||{})};up({auto:false,outfit:n})};
  const setApp=p=>up({appearance:{...a,...p}});
  const col=(k,l)=><label className="text-sm flex items-center gap-2">{l}<input type="color" value={o.colors[k]} onChange={e=>set({colors:{[k]:e.target.value}})}/></label>;
  return <div>
    <H sub="Layered avatar: change any piece without redrawing the rest.">Avatar Studio</H>
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="flex flex-col items-center"><div className="flex gap-2 mb-3"><Chip on={s.view!=='3D'} onClick={()=>up({view:'2D'})}>2D</Chip><Chip on={s.view==='3D'} onClick={()=>up({view:'3D'})}>3D</Chip></div>
        {s.view==='3D'?<Suspense fallback={<p className="h-[480px] grid place-items-center">Loading 3D…</p>}><Avatar3D o={o} a={a} className="w-full h-[480px] cursor-grab"/></Suspense>:<Avatar o={o} a={a} className="h-[480px]"/>}
        {s.view==='3D'&&<p className="text-xs opacity-60">Drag to rotate</p>}<p className="text-sm opacity-70 mt-2">{s.auto&&s.weather?'Auto mode: dressed for today’s weather':'Manual mode'}</p></Card>
      <Card>
        <div className="flex gap-2 mb-4"><Btn primary={s.auto} onClick={()=>up({auto:true})} disabled={!s.weather}>Auto (weather)</Btn><Btn primary={!s.auto} onClick={()=>up({auto:false,outfit:o})}>Manual</Btn></div>
        {!s.weather&&<p className="text-sm mb-3">Auto mode needs a city: <Link className="underline" to="/">pick one</Link>.</p>}
        <Pick label="Hairstyle" value={a.hair} opts={OPTS.hair} onChange={x=>setApp({hair:x})}/>
        <div className="flex flex-wrap gap-4 mb-4 items-center"><label className="text-sm flex gap-2 items-center">Hair colour<input type="color" value={a.hairColor} onChange={e=>setApp({hairColor:e.target.value})}/></label>
          <Link to="/create"><Btn>Edit body &amp; face</Btn></Link></div>
        <Pick label="Top" value={o.top} opts={OPTS.top} onChange={x=>set({top:x})}/>
        <Pick label="Bottom" value={o.bottom} opts={OPTS.bottom} onChange={x=>set({bottom:x,colors:{bottom:{shorts:'#c9b99a',jeans:'#3d4f6b',trousers:'#33312e'}[x]}})}/>
        <Pick label="Outerwear" value={o.outer} opts={OPTS.outer} onChange={x=>set({outer:x})}/>
        <Pick label="Footwear" value={o.shoes} opts={OPTS.shoes} onChange={x=>set({shoes:x,colors:{shoes:{sandals:'#b98b6b',sneakers:'#f4f1e8',boots:'#4a3526'}[x]}})}/>
        <div className="mb-4"><p className="text-xs uppercase tracking-wide opacity-60 mb-1">Accessories</p><div className="flex flex-wrap gap-2">{OPTS.acc.map(x=><Chip key={x} on={o.acc.includes(x)} onClick={()=>set({acc:o.acc.includes(x)?o.acc.filter(y=>y!==x):[...o.acc,x]})}>{cap(x)}</Chip>)}</div></div>
        <div className="flex gap-4 flex-wrap">{col('top','Top colour')}{o.outer!=='none'&&col('outer','Outer colour')}</div>
        <p className="text-xs opacity-60 mt-4">Your avatar and outfit save automatically.</p>
      </Card>
    </div>
  </div>;
}

const CATS=['Tops','Bottoms','Dresses','Jackets','Shoes','Accessories'];
export function WardrobePage(){
  const {s,up}=useStore();const [name,setName]=useState(''),[cat,setCat]=useState('Tops'),[img,setImg]=useState('');
  const file=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,320/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);setImg(c.toDataURL('image/jpeg',.7))};im.src=r.result};r.readAsDataURL(f)};
  const add=e=>{e.preventDefault();if(!name.trim())return;up(x=>({wardrobe:[...x.wardrobe,{id:Date.now(),name:name.trim(),cat,img}]}));setName('');setImg('')};
  return <div>
    <H sub="Upload and organise what you own.">My Wardrobe</H>
    <Card className="mb-6"><form onSubmit={add} className="flex flex-wrap gap-3 items-center">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Item name" className="rounded-full border border-forest/20 bg-transparent px-4 py-2"/>
      <select value={cat} onChange={e=>setCat(e.target.value)} className="rounded-full border border-forest/20 bg-transparent px-3 py-2 text-forest dark:text-forest">{CATS.map(c=><option key={c}>{c}</option>)}</select>
      <input type="file" accept="image/*" onChange={file} className="text-sm"/><Btn primary type="submit">Add item</Btn></form></Card>
    {s.wardrobe.length===0&&<Card>Your wardrobe is empty. Add an item or use “Add to Wardrobe” on the Outfit page.</Card>}
    {CATS.map(c=>{const items=s.wardrobe.filter(i=>i.cat===c);return items.length>0&&<div key={c} className="mb-6"><h2 className="font-serif text-2xl mb-2">{c}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{items.map(i=><Card key={i.id} className="!p-3">{i.img?<img src={i.img} alt={i.name} className="h-32 w-full object-cover rounded-2xl mb-2"/>:<div className="h-32 grid place-items-center text-4xl bg-sage/20 rounded-2xl mb-2">👚</div>}
        <p className="font-medium truncate">{i.name}</p><div className="flex gap-3 text-xs mt-1"><button onClick={()=>{const n=prompt('Rename item',i.name);n&&up(x=>({wardrobe:x.wardrobe.map(y=>y.id===i.id?{...y,name:n}:y)}))}} className="underline">Edit</button><button onClick={()=>up(x=>({wardrobe:x.wardrobe.filter(y=>y.id!==i.id)}))}><Trash2 size={14}/></button></div></Card>)}</div></div>})}
  </div>;
}

export function PlannerPage(){
  const {s}=useStore();const w=s.weather;if(!w)return <Empty/>;
  return <div><H sub={`A look for each day in ${s.city?.name}, in your ${s.style.toLowerCase()} style.`}>Weekly Planner</H>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{w.daily.map(d=>{
      const o=recommend({feels:(d.max+d.min)/2,temp:d.max,humidity:60,wind:d.wind,rain:d.rain,code:d.code},s.style,s.seed);const al=w.alerts.filter(a=>a.date===d.date);
      return <Card key={d.date} className="text-center"><p className="font-semibold">{day(d.date)}</p><p className="text-xs opacity-70">{T(d.max,s.units)} / {T(d.min,s.units)} · {d.label}</p>
        <Avatar o={o} a={s.appearance} className="h-48 mx-auto my-2"/><p className="text-xs">{cap(o.top)} · {cap(o.bottom)}{o.outer!=='none'?' · '+cap(o.outer):''}</p>
        {al.map((a,i)=><p key={i} className="text-xs mt-2 text-amber-700 dark:text-amber-300"><AlertTriangle size={12} className="inline"/> {a.text}</p>)}</Card>})}</div></div>;
}

export function FavoritesPage(){
  const {s,up}=useStore();const nav=useNavigate();
  return <div><H sub="Outfits you’ve saved.">Favorites</H>
    {s.favorites.length===0?<Card>No favorites yet. Save an outfit from the Outfit page.</Card>:
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{s.favorites.map(f=><Card key={f.id} className="text-center"><Avatar o={f.outfit} a={s.appearance} className="h-56 mx-auto"/>
      <p className="font-semibold mt-2">{f.outfit.style}</p><p className="text-xs opacity-70">{cap(f.outfit.top)} · {cap(f.outfit.bottom)} · {cap(f.outfit.shoes)}{f.outfit.outer!=='none'?' · '+cap(f.outfit.outer):''}</p>
      <p className="text-xs mt-1"><Heart size={12} className="inline"/> Suits {T(f.temp,s.units)}, {f.label}{f.city?` (${f.city})`:''}</p>
      <div className="flex gap-2 justify-center mt-3"><Btn primary onClick={()=>{up({outfit:f.outfit,auto:false});nav('/avatar')}}>Try on Avatar</Btn><Btn onClick={()=>up(x=>({favorites:x.favorites.filter(y=>y.id!==f.id)}))}>Remove</Btn></div></Card>)}</div>}</div>;
}

export function SettingsPage(){
  const {s,up,reset}=useStore();const {user,logout}=useAuth();
  return <div><H sub={user?'Your preferences sync to your account.':'Preferences are saved on this device.'}>Settings</H>
    <Card className="space-y-5 max-w-xl">
      <div><p className="text-xs uppercase tracking-wide opacity-60 mb-1">Account</p>{user?<><p className="mb-2">{user.name} · {user.email}</p><Btn onClick={logout}>Sign out</Btn></>:<><p className="mb-2 text-sm">You’re browsing as a guest.</p><Btn primary onClick={logout}>Sign in to save your data</Btn></>}</div>
      <Pick label="Temperature unit" value={s.units} opts={['C','F']} onChange={x=>up({units:x})}/>
      <Pick label="Preferred style" value={s.style} opts={STYLES} onChange={x=>up({style:x})}/>
      <div><p className="text-xs uppercase tracking-wide opacity-60 mb-1">Theme</p><Btn onClick={()=>up({dark:!s.dark})}>{s.dark?'Switch to light':'Switch to dark'}</Btn></div>
      <div><p className="text-xs uppercase tracking-wide opacity-60 mb-1">Data</p><Btn onClick={()=>{if(confirm('Reset avatar, wardrobe and favorites?'))reset()}}>Reset everything</Btn></div>
    </Card></div>;
}

const Swatch=({c,on,...p})=><button {...p} className={'h-9 w-9 rounded-full border-2 transition '+(on?'border-forest dark:border-cream scale-110':'border-transparent')} style={{background:c}}/>;
export function CreatePage(){
  const {s,up}=useStore();const nav=useNavigate();const [step,setStep]=useState(0);const a={...DEF,...s.appearance};
  const set=p=>up({appearance:{...a,...p}});
  const o=s.auto&&s.weather?recommend(s.weather,s.style,s.seed):DEFAULT;
  const titles=['Who are you?','Body & skin','Face','Hair'],last=step===titles.length-1;
  return <div><H sub={`Step ${step+1} of ${titles.length}. You can change this any time in Avatar Studio.`}>{s.onboarded?'Edit your avatar':'Create your avatar'}</H>
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="flex justify-center"><Avatar o={o} a={a} className="h-[460px]"/></Card>
      <Card><h2 className="font-serif text-2xl mb-4">{titles[step]}</h2>
        {step===0&&<div className="grid grid-cols-2 gap-3">{['female','male'].map(g=><button key={g} onClick={()=>set({gender:g,hair:g==='male'?'short':'long'})} className={'rounded-3xl border-2 p-6 text-lg transition '+(a.gender===g?'border-forest bg-sage/30 dark:border-sage':'border-forest/15 hover:bg-sage/20')}>{g==='female'?'♀ Female':'♂ Male'}</button>)}</div>}
        {step===1&&<><Pick label="Body shape" value={a.body} opts={BODIES} onChange={x=>set({body:x})}/>
          <p className="text-xs uppercase tracking-wide opacity-60 mb-2">Skin tone</p><div className="flex gap-3 flex-wrap">{SKINS.map((c,i)=><Swatch key={c} c={c} on={a.skin===i} onClick={()=>set({skin:i})} aria-label={'Skin tone '+(i+1)}/>)}</div></>}
        {step===2&&<><Pick label="Eye shape" value={a.eyes} opts={FACE.eyes} onChange={x=>set({eyes:x})}/>
          <p className="text-xs uppercase tracking-wide opacity-60 mb-2">Eye colour</p><div className="flex gap-3 mb-4">{EYE_COLORS.map(c=><Swatch key={c} c={c} on={a.eyeColor===c} onClick={()=>set({eyeColor:c})}/>)}</div>
          <Pick label="Eyebrows" value={a.brows} opts={FACE.brows} onChange={x=>set({brows:x})}/><Pick label="Nose" value={a.nose} opts={FACE.nose} onChange={x=>set({nose:x})}/><Pick label="Mouth" value={a.mouth} opts={FACE.mouth} onChange={x=>set({mouth:x})}/></>}
        {step===3&&<><Pick label="Hairstyle" value={a.hair} opts={OPTS.hair} onChange={x=>set({hair:x})}/><label className="text-sm flex gap-2 items-center">Hair colour<input type="color" value={a.hairColor} onChange={e=>set({hairColor:e.target.value})}/></label></>}
        <div className="flex gap-2 mt-6">{step>0&&<Btn onClick={()=>setStep(step-1)}>Back</Btn>}
          {last?<Btn primary onClick={()=>{up({onboarded:true});nav('/')}}>{s.onboarded?'Save':'Finish & continue'}</Btn>:<Btn primary onClick={()=>setStep(step+1)}>Next</Btn>}</div>
      </Card></div></div>;
}
