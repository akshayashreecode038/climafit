export const STYLES=['Casual','Formal','Streetwear','Sporty','Minimalist','College','Traditional'];
export const OPTS={top:['tee','longsleeve','hoodie','shirt','kurta'],bottom:['shorts','jeans','trousers'],outer:['none','jacket','raincoat','windbreaker'],shoes:['sandals','sneakers','boots'],acc:['sunglasses','cap','scarf','umbrella'],hair:['short','long','bun']};
const PAL=['#a9b8a0','#2f4a3a','#e9e2d0','#b98b6b','#6f7f9a'];
const BOT={shorts:'#c9b99a',jeans:'#3d4f6b',trousers:'#33312e'},SHO={sandals:'#b98b6b',sneakers:'#f4f1e8',boots:'#4a3526'};
export const colorsFor=(o,seed=0)=>({top:PAL[seed%5],bottom:BOT[o.bottom],outer:PAL[(seed+1)%5],shoes:SHO[o.shoes]});
export function recommend(w,style='Casual',seed=0){
  const t=w.feels,rain=w.rain>=40||(w.code>=51&&w.code<=82)||w.code>=95,wind=w.wind>=30,hot=t>=28,cold=t<=14,frz=t<=5,humid=w.humidity>=75,sunny=w.code<=2&&!rain;
  let top=hot?'tee':cold?'longsleeve':'tee',bottom=hot?'shorts':'jeans',outer='none',shoes=hot&&humid&&!rain?'sandals':'sneakers';const acc=[];
  if(cold)outer='jacket';if(frz)acc.push('scarf');
  if(rain){outer='raincoat';acc.push('umbrella');shoes='boots'}else if(wind&&outer==='none')outer='windbreaker';
  if(sunny&&t>=22)acc.push('sunglasses','cap');
  if(style==='Formal'){top='shirt';bottom='trousers';shoes='boots'}
  if(style==='Traditional'){top='kurta';bottom='trousers'}
  if(style==='Streetwear'&&!hot)top='hoodie';
  if(style==='Sporty'){bottom=cold?'trousers':'shorts';if(!rain)shoes='sneakers'}
  if(style==='College'&&cold)top='hoodie';
  if(style==='Minimalist'&&bottom==='jeans')bottom='trousers';
  const f=Math.round(t);
  const why={
    top:`Feels like ${f}°C${humid?' with high humidity':''}: ${hot?'light, breathable fabric keeps you cool':cold?'a warmer layer holds in heat':'a comfortable everyday layer'}.`,
    bottom:hot?'Shorts or light legwear beat the heat.':cold?'Full-length pieces keep your legs warm.':'Mild weather suits classic full-length pieces.',
    outer:rain?`Rain likely (${w.rain}%): a waterproof layer keeps you dry.`:wind?`Winds near ${Math.round(w.wind)} km/h: a windbreaker blocks the chill.`:cold?'Cold air calls for an insulating jacket.':'No extra layer needed.',
    shoes:rain?'Closed, water-resistant footwear for wet ground.':shoes==='sandals'?'Open footwear helps in warm, humid air.':'Comfortable, versatile everyday shoes.',
    acc:acc.length?acc.map(a=>({sunglasses:'sunglasses for bright sun',cap:'a cap for shade',scarf:'a scarf for the cold',umbrella:'an umbrella for rain'}[a])).join(', ')+'.':'No accessories needed today.'};
  const o={style,top,bottom,outer,shoes,acc,why};o.colors=colorsFor(o,seed);return o;
}
export const DEFAULT=(()=>{const o={style:'Casual',top:'tee',bottom:'jeans',outer:'none',shoes:'sneakers',acc:[],why:{}};o.colors=colorsFor(o);return o})();
