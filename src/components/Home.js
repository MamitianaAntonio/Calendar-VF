import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../components/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { setAuthToken, setProviderToken } = useAuth();

  // Fonction pour gérer la connexion avec Google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
      }
    });

    if (error) {
      console.error('Erreur lors de la connexion avec Google:', error.message);
      alert('Erreur lors de la connexion avec Google.');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erreur lors de la récupération de la session:', error.message);
      } else if (session) {
        console.log('Session active, redirection vers Dashboard');
        setAuthToken(session.access_token);
        setProviderToken(session.provider_token); // Stockez le provider token dans le contexte
        localStorage.setItem('access_token', session.access_token);
        localStorage.setItem('provider_token', session.provider_token);
        navigate('/dashboard'); 
      }
    };

    checkSession();
  }, [navigate, setAuthToken, setProviderToken]); // Assurez-vous que setAuthToken est bien dans le tableau des dépendances

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Calendar</h1>
      </header>

      <div className={styles.homeContainer}>
        <h2 className={styles.welcomeText}>
          Bienvenue dans <span className={styles.calendarEffect}>Calendar</span>
        </h2>
        <h3 className={styles.message}>
          "Planifiez, organisez et rassurez l'emploi de temps"
        </h3>

        <button className={styles.btn} onClick={handleGoogleLogin}>
          Se connecter avec Google
        </button>

        <div className={styles.box}>
          {/* Des div vides peuvent être supprimées si non utilisées */}
          {[...Array(10)].map((_, index) => (
            <div key={index}></div>
          ))}
        </div>
        <h3 className={styles.copyright}>©copyright Par SyncFusion</h3>
      </div>
    </>
  );
}

export default Home;
