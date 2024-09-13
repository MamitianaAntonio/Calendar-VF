import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';
import { AuthProvider } from './components/AuthContext';

// Supabase client setup
const supabase = createClient(
  "https://qeyjxucrpwbsqbnoyfgw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleWp4dWNycHdic3Fibm95Zmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzgzMDQsImV4cCI6MjAzOTY1NDMwNH0.ePSDtjyZun_0Y4jG7hFXvPWoc0rxI1GmLMiSpCrCWiA"
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <SessionContextProvider supabaseClient={supabase}>
        <App />
      </SessionContextProvider>
    </AuthProvider>
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
