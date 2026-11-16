import {useEffect} from 'react';
import {Navigate,NavLink,Route,Routes,useLocation} from 'react-router-dom';
import {AnimatePresence,motion} from 'framer-motion';
import {CloudSun,Shirt,User,LayoutGrid,CalendarDays,Heart,Settings,LogOut} from 'lucide-react';
import {useStore} from './store.jsx';
import {useAuth} from './auth.jsx';
import Login from './Login.jsx';
import {WeatherPage,OutfitPage,AvatarPage,WardrobePage,PlannerPage,FavoritesPage,SettingsPage,CreatePage} from './pages.jsx';
const NAV=[['/','Weather','Weather',CloudSun],['/outfit','Outfit','Outfit',Shirt],['/avatar','Avatar Studio','Avatar',User],['/wardrobe','My Wardrobe','Wardrobe',LayoutGrid],['/planner','Planner','Planner',CalendarDays],['/favorites','Favorites','Favorites',Heart],['/settings','Settings','Settings',Settings]];
export default function App(){
  const {s}=useStore();const A=useAuth();const loc=useLocation();const w=s.weather;
  useEffect(()=>{document.documentElement.classList.toggle('dark',s.dark)},[s.dark]);
  if(!A.user&&!A.guest)return <Login/>;
  if(!s.onboarded&&loc.pathname!=='/create')return <Navigate to="/create" replace/>;
  const tone=!w?'from-cream to-sage/30':w.code>=51?'from-slate-200 to-sage/40':w.temp>=30?'from-amber-50 to-sage/30':w.temp<=10?'from-sky-50 to-sage/30':'from-cream to-sage/30';
  const name=A.user?.name;
  return <div className={`min-h-screen bg-gradient-to-b ${tone} dark:from-[#101612] dark:to-[#1b2620] text-forest dark:text-cream font-sans transition-colors duration-700`}>
    <header className="sticky top-0 z-20 backdrop-blur-md bg-cream/70 dark:bg-black/30 border-b border-forest/10">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
        <span className="font-serif text-2xl">ClimaFit</span>
        {s.onboarded&&<nav className="hidden md:flex flex-1 justify-center gap-1">{NAV.map(([to,l,,I])=>
          <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`relative px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${isActive?'text-cream dark:text-forest':'hover:bg-sage/30'}`}>
            {({isActive})=><>{isActive&&<motion.span layoutId="pill" transition={{type:'spring',duration:.4}} className="absolute inset-0 rounded-full bg-forest dark:bg-sage"/>}<span className="relative">{l}</span></>}</NavLink>)}</nav>}
        <div className="ml-auto flex items-center gap-2">
          {name?<span className="hidden sm:flex items-center gap-2 text-sm"><span className="h-8 w-8 rounded-full grid place-items-center bg-forest text-cream dark:bg-sage dark:text-forest">{name[0].toUpperCase()}</span>{name}</span>:<span className="text-sm opacity-70">Guest</span>}
          <button onClick={A.logout} title={name?'Sign out':'Sign in'} aria-label={name?'Sign out':'Sign in'} className="rounded-full p-2 hover:bg-sage/30"><LogOut size={16}/></button>
        </div>
      </div>
    </header>
    <AnimatePresence mode="wait"><motion.main key={loc.pathname} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.25}} className="max-w-6xl mx-auto p-4 md:p-8 pb-28 md:pb-8">
      <Routes location={loc}><Route path="/" element={<WeatherPage/>}/><Route path="/outfit" element={<OutfitPage/>}/><Route path="/avatar" element={<AvatarPage/>}/><Route path="/wardrobe" element={<WardrobePage/>}/><Route path="/planner" element={<PlannerPage/>}/><Route path="/favorites" element={<FavoritesPage/>}/><Route path="/create" element={<CreatePage/>}/><Route path="/settings" element={<SettingsPage/>}/></Routes>
    </motion.main></AnimatePresence>
    {s.onboarded&&<nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex justify-around backdrop-blur-md bg-cream/90 dark:bg-black/60 border-t border-forest/10 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))]">
      {NAV.map(([to,,short,I])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`flex flex-col items-center gap-0.5 text-[10px] px-1 ${isActive?'text-forest dark:text-sage font-semibold':'opacity-60'}`}><I size={20}/>{short}</NavLink>)}</nav>}
  </div>;
}
