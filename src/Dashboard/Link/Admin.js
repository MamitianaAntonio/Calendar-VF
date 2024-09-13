// src/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import styles from './admin.module.css';
import synFusion from '../../img/SyncFusion.png';
import olympiade from '../../img/olympiade.png';
import pnm from '../../img/pnm.png';

const Admin = () => {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
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

         // Récupérer l'URL de l'avatar depuis user_metadata
         const avatarUrl = session.user.user_metadata.avatar_url;
         
         if (avatarUrl) {
          setUserAvatar(avatarUrl);
        }
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
    <div className={styles.container}>
      <h1 className={styles.texte}>ESPACE UTILISATEUR </h1>
      <div className={styles.userInfo}> {/* Conteneur pour l'avatar et le nom */}
          {userAvatar && (
            <img 
              src={userAvatar} 
              alt="Avatar" 
              className={styles.avatar} 
            />
          )}</div>
      <h1>{userName}</h1>

      <div className={styles.proposContainer}>
          <h2 className={styles.textePropos}>Nos propos</h2>
          <p className={styles.presentation}>Syncfusion est un groupe de cinq personnes chargé de créer l'agenda pour les passerelles numériques dans le cadre de l'Olympiade Numérique. Notre mission est de concevoir et d'organiser des plannings efficaces pour optimiser la gestion des événements numériques de cette compétition, en assurant une coordination fluide et une bonne organisation des activités.</p>
      </div>

      <div className={styles.final}>

          <div className={styles.partenaire}>
              <h2>Remerciement</h2>
              <div className={styles.imgPartenaire}>
                <img src={olympiade} alt="Olympiade" width="140px" height="100px"/>
                <img src={pnm} alt="Passerelles Numeriques" width="240px" height="100px"/>
              </div>

          </div>

          <div className={styles.contact}>
            <h2>Contact</h2>
            <div className={styles.ImgContact}>
                <img src={synFusion} alt="SyncFusion" width="100px" height="100px"/>
                <h3 className={styles.Number}>038 10 488 34</h3>
            </div>
          </div>
      </div>

      <button onClick={handleLogout} className={styles.btn}>
        Se déconnecter
      </button>


    </div>
  );
};


export default Admin;






