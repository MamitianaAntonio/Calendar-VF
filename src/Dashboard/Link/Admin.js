// src/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log('Pas de session active, redirection vers la page d\'accueil');
        navigate('/');
      } else {
        const userName = session.user.user_metadata.full_name;
        setUserName(userName);
      }
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Bienvenue sur votre Dashboard,</h1>
      <h1>{userName}</h1>
      <button onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
};

export default Admin;






