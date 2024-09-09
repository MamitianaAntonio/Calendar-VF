// Home.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { supabase } from '../lib/supabaseClient';

function Home() {

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Erreur lors de la connexion avec Google:', error.message);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erreur lors de la récupération de la session:', error.message);
      } else if (session) {
        console.log('Session active, redirection vers Dashboard');
        navigate('/dashboard');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <>
            <header className={styles.header}>
                <h1 className={styles.title}>Calendar</h1>
            </header>

            <div className={styles.homeContainer}>
              <h2 className={styles.welcomeText}>Bienvenu dans <span className={styles.calendarEffect}>Calendar</span></h2>
              <h3 className={styles.message}>"Planifiez, organisez et rassurez l'emploi de temps"</h3>

            <button className={styles.btn}   onClick={handleGoogleLogin}   >
              Se connecter avec Google
            </button>

            <div className={styles.box}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
                <h3 className={styles.copyright}>©copyright  Par  SyncFusion</h3>      
            </div>
    </>
  );
}

export default Home;

