import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {SKINS,shape,DEF} from './look.js';

const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.75});
const cyl=(rt,rb,h)=>new THREE.CylinderGeometry(rt,rb,h,28);
function clear(g){[...g.children].forEach(c=>{g.remove(c);c.traverse(n=>{n.geometry?.dispose();n.material?.dispose?.()})})}

function build(api,o,a){
  const g=api.group;if(!g)return;clear(g);api.eyes=[];a={...DEF,...a};
  const {k,h}=shape(a);
  const up=new THREE.Group(),lo=new THREE.Group();up.scale.x=k;lo.scale.x=h;g.add(up,lo);
  const add=(geo,col,x,y,z,p=g)=>{const m=new THREE.Mesh(geo,M(col));m.position.set(x,y,z);p.add(m);return m};
  const sk=SKINS[a.skin]||SKINS[2],c=o.colors,long=o.top!=='tee',has=x=>o.acc.includes(x),F=a.gender==='female';
  const sh=new THREE.Mesh(new THREE.CircleGeometry(.45,32),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.12}));sh.rotation.x=-Math.PI/2;sh.position.y=.002;g.add(sh);
  // body
  add(cyl(.2,.17,.62),sk,0,1.1,0,up);add(cyl(.05,.06,.12),sk,0,1.46,0,up);
  [-1,1].forEach(s=>{add(cyl(.05,.045,.62),sk,s*.27,1.08,0,up);add(cyl(.075,.065,.82),sk,s*.09,.41,0,lo)});
  // bottoms + shoes
  add(cyl(.185,.185,.16),c.bottom,0,.8,0,lo);
  [-1,1].forEach(s=>{
    o.bottom==='shorts'?add(cyl(.088,.088,.38),c.bottom,s*.09,.63,0,lo):add(cyl(.086,.074,.82),c.bottom,s*.09,.41,0,lo);
    if(o.shoes==='boots'){add(cyl(.09,.09,.24),c.shoes,s*.09,.12,0,lo);add(new THREE.BoxGeometry(.12,.07,.26),c.shoes,s*.09,.035,.05,lo)}
    else if(o.shoes==='sandals')add(new THREE.BoxGeometry(.11,.025,.25),c.shoes,s*.09,.013,.05,lo);
    else add(new THREE.BoxGeometry(.125,.08,.27),c.shoes,s*.09,.04,.05,lo);
  });
  // top + outerwear
  if(o.top==='kurta')add(cyl(.208,.2,.96),c.top,0,.93,0,up);else add(cyl(.208,.178,.64),c.top,0,1.1,0,up);
  [-1,1].forEach(s=>long?add(cyl(.058,.053,.6),c.top,s*.27,1.08,0,up):add(cyl(.058,.056,.26),c.top,s*.27,1.28,0,up));
  if(o.top==='hoodie'){const t=add(new THREE.TorusGeometry(.1,.035,12,24),c.top,0,1.43,-.02,up);t.rotation.x=Math.PI/2}
  const OH={raincoat:[.85,1.0],jacket:[.66,1.1],windbreaker:[.62,1.12]}[o.outer];
  if(OH){add(cyl(.228,.2,OH[0]),c.outer,0,OH[1],0,up);[-1,1].forEach(s=>add(cyl(.066,.06,.62),c.outer,s*.27,1.08,0,up))}
  if(has('scarf')){const sc=add(new THREE.TorusGeometry(.1,.035,12,24),'#b98b6b',0,1.44,0,up);sc.rotation.x=Math.PI/2}
  // head + face
  add(new THREE.SphereGeometry(.14,32,24),sk,0,1.6,0);
  const ES={round:[1,1],almond:[1.3,.7],wide:[1.15,1.25]}[a.eyes]||[1,1],ex=a.eyes==='wide'?.058:.05;
  [-1,1].forEach(s=>{
    const eg=new THREE.Group();eg.position.set(s*ex,1.62,.122);eg.scale.set(ES[0],ES[1],1);g.add(eg);eg.userData.sy=ES[1];
    add(new THREE.SphereGeometry(.024,16,12),'#ffffff',0,0,0,eg);add(new THREE.SphereGeometry(.014,12,12),a.eyeColor,0,0,.016,eg);api.eyes.push(eg);
    const b=add(new THREE.BoxGeometry(.06,a.brows==='thick'?.02:.011,.01),a.hairColor,s*ex,1.668,.13);if(a.brows==='soft')b.rotation.z=s*-.15;
  });
  add(new THREE.SphereGeometry(.018,12,12),sk,0,1.585,.14).scale.set({small:.8,medium:1,broad:1.5}[a.nose],1,1);
  if(a.mouth==='smile'){const m=add(new THREE.TorusGeometry(.035,.006,8,16,Math.PI),'#a9564f',0,1.565,.133);m.rotation.z=Math.PI}
  else add(new THREE.BoxGeometry(a.mouth==='full'?.07:.06,a.mouth==='full'?.022:.008,.01),'#a9564f',0,1.545,.135);
  // hair
  add(new THREE.SphereGeometry(.152,32,24,0,Math.PI*2,0,Math.PI*.55),a.hairColor,0,1.61,0);
  if(a.hair==='long')add(new THREE.BoxGeometry(.29,.42,.08),a.hairColor,0,1.44,-.1);
  if(a.hair==='bun')add(new THREE.SphereGeometry(.065,16,16),a.hairColor,0,1.77,0);
  // accessories
  if(has('sunglasses'))add(new THREE.BoxGeometry(.23,.04,.03),'#1d1d1d',0,1.62,.14);
  if(has('cap')){add(new THREE.SphereGeometry(.16,32,16,0,Math.PI*2,0,Math.PI*.5),c.top,0,1.64,0);add(new THREE.BoxGeometry(.2,.012,.14),c.top,0,1.645,.16)}
  if(has('umbrella')){add(cyl(.01,.01,.9),'#222222',.34,1.0,.05);add(new THREE.ConeGeometry(.45,.2,28),'#2f4a3a',.34,1.5,.05)}
}

export default function Avatar3D({o,a,className=''}){
  const ref=useRef(),api=useRef({eyes:[]});
  useEffect(()=>{
    const el=ref.current,w=el.clientWidth||400,h=el.clientHeight||480;
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setSize(w,h);el.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,w/h,.1,50);cam.position.set(0,1.15,4.3);
    scene.add(new THREE.HemisphereLight(0xffffff,0x8a9a8a,1.2));
    const d=new THREE.DirectionalLight(0xffffff,1.4);d.position.set(2,4,3);scene.add(d);
    const ctl=new OrbitControls(cam,renderer.domElement);
    Object.assign(ctl,{enableZoom:false,enablePan:false,autoRotate:true,autoRotateSpeed:1.5,minPolarAngle:Math.PI*.3,maxPolarAngle:Math.PI*.6});ctl.target.set(0,.95,0);
    const group=new THREE.Group();scene.add(group);api.current.group=group;
    const ro=new ResizeObserver(()=>{const W=el.clientWidth,H=el.clientHeight;if(!W||!H)return;renderer.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix()});ro.observe(el);
    let raf;const t0=performance.now();
    const loop=()=>{raf=requestAnimationFrame(loop);const t=(performance.now()-t0)/1000;
      group.position.y=Math.sin(t*1.6)*.015;const b=(t%5)>4.85?.1:1;api.current.eyes.forEach(e=>{e.scale.y=e.userData.sy*b});
      ctl.update();renderer.render(scene,cam)};
    build(api.current,o,a);loop();
    return()=>{cancelAnimationFrame(raf);ro.disconnect();ctl.dispose();clear(group);renderer.dispose();el.removeChild(renderer.domElement)};
  },[]);
  useEffect(()=>{build(api.current,o,a)},[JSON.stringify(o),JSON.stringify(a)]);
  return <div ref={ref} className={className} title="Drag to rotate"/>;
}
