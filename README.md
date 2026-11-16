# ClimaFit
Weather → outfit → avatar. React + Vite + React Router + Tailwind + Framer Motion + Lucide.

## Run
```bash
npm install
npm run dev
```
Open the printed URL. No API key is needed: live weather comes from Open-Meteo (src/weather.js).
To use OpenWeather instead, put `VITE_OPENWEATHER_KEY` in `.env` and rewrite `geocode`/`getWeather` in src/weather.js, keeping the same return shape.

## Structure
- `src/engine.js` rule-based recommender (feels-like, humidity, rain, wind, condition + style)
- `src/Avatar.jsx` layered SVG avatar (body, hair, bottoms, shoes, tops, outerwear, accessories) with idle float + blink
- `src/Avatar3D.jsx` Three.js avatar built from primitives, driven by the same outfit/appearance data (drag to rotate, idle bob, blinking); lazy-loaded
- `src/look.js` avatar options (skin tones, body shapes, face features) shared by the 2D and 3D avatars; `/create` is the first-launch avatar creator
- `src/store.jsx` shared state saved to localStorage (city, weather, style, outfit, avatar, favorites, wardrobe)
- `src/pages.jsx` the seven pages

## Next
Outfit builder from wardrobe items, saving planner looks to dates, Supabase/Firebase accounts and image storage, richer clothing art.

## Accounts
Two modes, chosen automatically:
- **Cloud (Firebase):** copy `.env.example` to `.env` and fill in your Firebase web-app keys. In the Firebase console enable Authentication (Email/Password and Google) and create a Firestore database. Each user's avatar, wardrobe, favourites and settings sync to `users/{uid}`. Suggested Firestore rules:
```
rules_version = '2';
service cloud.firestore { match /databases/{db}/documents {
  match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; } } }
```
- **Demo (no keys):** sign up and sign in work, but accounts live only in this browser. Use for development only.

Guests can use the app without signing in; their data stays on the device. Wardrobe photos are shrunk to 320px before saving so they fit in Firestore.
