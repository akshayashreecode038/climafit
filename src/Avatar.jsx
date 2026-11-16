import {SKINS,shape,DEF} from './look.js';
const tf=k=>`translate(100 0) scale(${k} 1) translate(-100 0)`;
const EYE={round:[3.4,4.2,10],almond:[4.6,2.8,10],wide:[3.8,4.8,12]};
export default function Avatar({o,a,className=''}){
  a={...DEF,...a};
  const sk=SKINS[a.skin]||SKINS[2],c=o.colors,hc=a.hairColor,{k,h}=shape(a),female=a.gender==='female';
  const long=o.top!=='tee',pants=o.bottom!=='shorts',topH=o.top==='kurta'?172:124,outH={raincoat:150,jacket:132,windbreaker:122}[o.outer];
  const [rx,ry,ex]=EYE[a.eyes]||EYE.round,L=100-ex,R=100+ex,line='#7a4a3a';
  const brow=(x,s)=>a.brows==='straight'||a.brows==='thick'?`M${x-5} 56 H${x+5}`:`M${x-5*s} 58 Q${x} 54 ${x+5*s} 56`;
  const nose={small:'M99 72 Q96 79 100 80',medium:'M100 70 Q95 79 100 81',broad:'M94 78 Q100 84 106 78 M98 72 Q96 78 98 80'}[a.nose];
  return(
  <svg viewBox="0 0 200 420" className={'avatar-float '+className} role="img" aria-label="Avatar">
    <ellipse cx="100" cy="410" rx="55" ry="7" fill="#0002"/>
    <g transform={tf(h)}>
      <rect x="72" y="230" width="24" height="160" rx="11" fill={sk}/><rect x="104" y="230" width="24" height="160" rx="11" fill={sk}/>
      {pants?<><rect x="70" y="226" width="30" height="162" rx="12" fill={c.bottom}/><rect x="100" y="226" width="30" height="162" rx="12" fill={c.bottom}/></>
            :<><rect x="70" y="226" width="30" height="62" rx="10" fill={c.bottom}/><rect x="100" y="226" width="30" height="62" rx="10" fill={c.bottom}/></>}
      {o.shoes==='boots'?<><rect x="68" y="362" width="34" height="38" rx="10" fill={c.shoes}/><rect x="98" y="362" width="34" height="38" rx="10" fill={c.shoes}/></>
        :o.shoes==='sandals'?<><rect x="66" y="392" width="38" height="8" rx="4" fill={c.shoes}/><rect x="96" y="392" width="38" height="8" rx="4" fill={c.shoes}/></>
        :<><rect x="64" y="380" width="40" height="20" rx="10" fill={c.shoes}/><rect x="96" y="380" width="40" height="20" rx="10" fill={c.shoes}/></>}
    </g>
    <g transform={tf(k)}>
      <rect x="44" y="124" width="20" height="108" rx="10" fill={sk}/><rect x="136" y="124" width="20" height="108" rx="10" fill={sk}/>
      <rect x="66" y="116" width="68" height="112" rx="20" fill={sk}/><rect x="90" y="96" width="20" height="26" fill={sk}/>
      <rect x="62" y="112" width="76" height={topH} rx="20" fill={c.top}/>
      <rect x="40" y="120" width="26" height={long?112:44} rx="13" fill={c.top}/><rect x="134" y="120" width="26" height={long?112:44} rx="13" fill={c.top}/>
      {o.top==='hoodie'&&<path d="M76 112 Q100 140 124 112 Q100 100 76 112Z" fill="#0002"/>}
      {o.top==='shirt'&&<path d="M100 114 V180" stroke="#0003" strokeWidth="2"/>}
      {outH&&<><rect x="56" y="108" width="88" height={outH} rx="18" fill={c.outer}/><rect x="32" y="116" width="28" height="118" rx="14" fill={c.outer}/><rect x="140" y="116" width="28" height="118" rx="14" fill={c.outer}/><path d={`M100 108 V${108+outH}`} stroke="#0003" strokeWidth="2"/></>}
      {o.acc.includes('scarf')&&<rect x="78" y="98" width="44" height="16" rx="8" fill="#b98b6b"/>}
    </g>
    <circle cx="100" cy="68" r="30" fill={sk}/>
    <path d="M70 66 Q72 34 100 34 Q128 34 130 66 Q116 50 100 50 Q84 50 70 66Z" fill={hc}/>
    {a.hair==='long'&&<><rect x="68" y="56" width="14" height="84" rx="7" fill={hc}/><rect x="118" y="56" width="14" height="84" rx="7" fill={hc}/></>}
    {a.hair==='bun'&&<circle cx="100" cy="27" r="13" fill={hc}/>}
    {[L,R].map((x,i)=><g key={i} className="blink"><ellipse cx={x} cy="66" rx={rx} ry={ry} fill="#fff" stroke="#0002" strokeWidth=".6"/><circle cx={x} cy="66" r={Math.min(rx,ry)*.85} fill={a.eyeColor}/><circle cx={x} cy="66" r="1.2" fill="#111"/></g>)}
    {female&&<path d={`M${L-rx} 65 l-2.5 -2 M${R+rx} 65 l2.5 -2`} stroke="#222" strokeWidth="1.4" strokeLinecap="round"/>}
    <path d={brow(L,1)+' '+brow(R,-1)} stroke={hc} strokeWidth={a.brows==='thick'?4:2.2} fill="none" strokeLinecap="round"/>
    <path d={nose} stroke={line} strokeOpacity=".5" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {a.mouth==='full'?<path d="M91 85 Q100 81 109 85 Q100 95 91 85Z" fill="#b5605a"/>
      :<path d={a.mouth==='neutral'?'M93 87 H107':'M92 85 Q100 92 108 85'} stroke={line} fill="none" strokeWidth="2" strokeLinecap="round"/>}
    {o.acc.includes('sunglasses')&&<rect x="78" y="60" width="44" height="13" rx="6" fill="#222"/>}
    {o.acc.includes('cap')&&<><path d="M68 50 Q100 14 132 50Z" fill={c.top}/><rect x="66" y="48" width="52" height="7" rx="3" fill="#0003"/></>}
    {o.acc.includes('umbrella')&&<><path d="M158 150 V238" stroke="#222" strokeWidth="3"/><path d="M120 152 Q158 92 196 152Z" fill="#2f4a3a"/></>}
  </svg>);
}
