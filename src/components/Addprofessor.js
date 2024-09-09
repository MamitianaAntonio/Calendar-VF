// src/components/AddProfessor.js
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Ajouter Professeur</button>
    </form>
  );
}

export default AddProfessor;
