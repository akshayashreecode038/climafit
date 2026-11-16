import {initializeApp} from 'firebase/app';
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
const e=import.meta.env;
// Cloud mode turns on when Firebase keys are present in .env; otherwise the app runs in local demo mode.
export const cloud=!!e.VITE_FIREBASE_API_KEY;
const app=cloud?initializeApp({apiKey:e.VITE_FIREBASE_API_KEY,authDomain:e.VITE_FIREBASE_AUTH_DOMAIN,projectId:e.VITE_FIREBASE_PROJECT_ID,appId:e.VITE_FIREBASE_APP_ID}):null;
export const auth=app?getAuth(app):null;
export const db=app?getFirestore(app):null;
export const googleProvider=cloud?new GoogleAuthProvider():null;
