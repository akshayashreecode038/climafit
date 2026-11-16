// Open-Meteo: real live data, no API key. To use OpenWeather instead, replace geocode/getWeather and keep the returned shape.
const label=c=>c===0?'Clear':c<=2?'Partly cloudy':c===3?'Overcast':c<=48?'Fog':c<=57?'Drizzle':c<=67?'Rain':c<=77?'Snow':c<=82?'Showers':'Thunderstorm';
const alertsFor=daily=>daily.flatMap(d=>[
  d.code>=95&&'Thunderstorm expected',d.max>=36&&'Extreme heat',d.min<=0&&'Freezing temperatures',d.wind>=50&&'Strong winds',d.rain>=80&&'Heavy rain likely'
].filter(Boolean).map(text=>({date:d.date,text})));
export async function geocode(q){
  const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`);
  if(!r.ok)throw new Error('City search failed');
  const c=(await r.json()).results?.[0];if(!c)throw new Error(`No city found for "${q}"`);
  return {name:`${c.name}${c.country?', '+c.country:''}`,lat:c.latitude,lon:c.longitude};
}
export async function getWeather({lat,lon}){
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,wind_speed_10m_max,sunrise,sunset&timezone=auto&forecast_days=7`;
  const r=await fetch(u);if(!r.ok)throw new Error('Weather service unavailable');
  const j=await r.json(),c=j.current,d=j.daily;
  const daily=d.time.map((t,i)=>({date:t,max:d.temperature_2m_max[i],min:d.temperature_2m_min[i],rain:d.precipitation_probability_max[i]??0,code:d.weather_code[i],wind:d.wind_speed_10m_max[i],label:label(d.weather_code[i])}));
  return {temp:c.temperature_2m,feels:c.apparent_temperature,humidity:c.relative_humidity_2m,wind:c.wind_speed_10m,code:c.weather_code,label:label(c.weather_code),rain:daily[0].rain,sunrise:d.sunrise[0],sunset:d.sunset[0],daily,alerts:alertsFor(daily)};
}
export const T=(c,u)=>u==='F'?Math.round(c*9/5+32)+'°F':Math.round(c)+'°C';
