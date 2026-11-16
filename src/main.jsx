import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';import {Provider} from './store.jsx';import {AuthProvider,useAuth} from './auth.jsx';import './index.css';
function Root(){
  const {user,loading}=useAuth();
  if(loading)return <div className="min-h-screen grid place-items-center bg-cream text-forest font-serif text-3xl animate-pulse">ClimaFit</div>;
  return <Provider key={user?.uid||'guest'} uid={user?.uid}><App/></Provider>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><Root/></AuthProvider></BrowserRouter>);
