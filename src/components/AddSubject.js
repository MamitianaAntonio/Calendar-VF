// src/components/AddProfessor.js
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Assurez-vous que le chemin est correct

const AddSubject = ({ onSubjectAdded }) => {
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      setError('Le nom de la matière ne peut pas être vide.');
      return;
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert([{ name: subjectName.trim() }]);

    if (error) {
      console.error('Error adding subject:', error.message);
      setError('Erreur lors de l\'ajout de la matière.');
    } else {
      console.log('Subject added:', data); // Ajoutez ce log pour vérifier les données
      setSubjectName('');
      setError(null);
      if (onSubjectAdded) onSubjectAdded();
    }
  };

  return (
    <div>
      <h3>Ajouter une Matière</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Nom de la matière"
        />
        <button type="submit">Ajouter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddSubject;

