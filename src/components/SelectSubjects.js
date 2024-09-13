// SelectSubjects.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Importez l'instance Supabase

function SelectSubjects({ onSelect, onRemove }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    // Récupérez la liste des matières depuis Supabase
    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*');
      if (error) {
        console.error('Erreur de récupération des matières:', error);
        return;
      }
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSubjects((prev) =>
      checked ? [...prev, value] : prev.filter((sub) => sub !== value)
    );
  };

  const handleRemoveSelected = async () => {
    // Supprimer les matières sélectionnées de la base de données
    const { error } = await supabase
      .from('subjects')
      .delete()
      .in('name', selectedSubjects);

    if (error) {
      console.error('Erreur de suppression des matières:', error);
      return;
    }

    // Mettre à jour l'état local et recharger les données
    setSubjects(subjs => subjs.filter(sub => !selectedSubjects.includes(sub.name)));
    setSelectedSubjects([]);
    onRemove(selectedSubjects); // Appeler la fonction de rappel pour mettre à jour les matières sélectionnées
  };

  useEffect(() => {
    onSelect(selectedSubjects);
  }, [selectedSubjects, onSelect]);

  return (
    <div>
      <h3>Sélectionner les matières</h3>
      {subjects.map((subject) => (
        <div key={subject.id}>
          <label>
            <input
              type="checkbox"
              value={subject.name}
              checked={selectedSubjects.includes(subject.name)}
              onChange={handleChange}
            />
            {subject.name}
          </label>
        </div>
      ))}
      <button onClick={handleRemoveSelected} disabled={selectedSubjects.length === 0}>
        Supprimer
      </button>
    </div>
  );
}

export default SelectSubjects;
