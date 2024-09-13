// src/components/AddProfessor.js
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '../components/styles/location.module.css';

function AddProfessor({ onProfessorAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const supabase = useSupabaseClient();

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    // Validation des champs
    if (!name || !email) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Ajouter le professeur à la base de données
    const { error } = await supabase
      .from('professors')
      .insert([{ name, email }]);

    if (error) {
      alert('Erreur lors de l\'ajout du professeur : ' + error.message);
    } else {
      // Appeler la fonction de rappel pour signaler que le professeur a été ajouté
      onProfessorAdded();
      setName('');
      setEmail('');
    }
        // Recharger la page après un court délai
        setTimeout(() => {
          window.location.reload();
        }, 500)

  };



  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
          <br/>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
          <br/>
        <button type="submit" className={styles.btn}>Ajouter Professeur</button>
      </form> 
    </div>
  );
}

export default AddProfessor;
