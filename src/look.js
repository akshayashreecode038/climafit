export const SKINS=['#f6dcc6','#f1d3b8','#e0b58c','#c58c5e','#8d5a3a','#5a3825'];
export const EYE_COLORS=['#2b2118','#5a3a22','#3f7a5a','#3f6fa8','#8a6a2a'];
export const BODIES=['slim','average','curvy','athletic'];
export const FACE={eyes:['round','almond','wide'],brows:['soft','straight','thick'],nose:['small','medium','broad'],mouth:['smile','neutral','full']};
export const DEF={gender:'female',body:'average',skin:2,hair:'long',hairColor:'#3b2a20',eyes:'round',eyeColor:'#5a3a22',brows:'soft',nose:'medium',mouth:'smile'};
// k = upper-body width factor, h = hip/leg width factor
export function shape(a){
  const m=a.gender==='male';let k=m?1.1:.94,h=m?1:1.05;
  if(a.body==='slim'){k*=.9;h*=.9}else if(a.body==='curvy'){h*=1.2;k*=1.02}else if(a.body==='athletic'){k*=1.1;h*=1.05}
  return {k,h};
}
