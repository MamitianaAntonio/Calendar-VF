import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from './lib/supabaseClient';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if('serviceWorker' in navigator){
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('ServiceWorker registration successful : ', registration);
    })
    .catch(function(error) {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}


reportWebVitals();
