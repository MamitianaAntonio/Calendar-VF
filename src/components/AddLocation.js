// onLocationAdded.js   
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Assurez-vous que le chemin est correct
import styles from '../components/styles/location.module.css';

const AddLocation = ({ onLocationAdded }) => {
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!locationName.trim()) {
      setError('Le nom du lieu ne peut pas être vide.');
      return;
    }

    const { data, error: insertError } = await supabase
      .from('locations')
      .insert([{ name: locationName.trim() }]);

    if (insertError) {
      console.error('Erreur lors de l\'ajout du lieu:', insertError.message);
      setError('Erreur lors de l\'ajout du lieu.');
    } else {
      console.log('Lieu ajouté:', data); // Ajoutez ce log pour vérifier les données
      setLocationName('');
      setError(null);
      if (onLocationAdded) onLocationAdded();
    }
    setTimeout(() => {
      window.location.reload();
    }, 500)
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.txt}>Ajouter un Lieu</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Nom du lieu"
        />
        <br/>
        <button type="submit" className={styles.btn}>Ajouter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddLocation;
