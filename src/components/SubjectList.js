import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Assurez-vous que le chemin est correct

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*');

        if (error) {
          console.error('Error fetching subjects:', error.message);
          setError('Erreur lors du chargement des matières.');
        } else {
          console.log('Fetched subjects:', data); // Ajoutez ce log pour vérifier les données
          setSubjects(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Erreur inattendue lors du chargement des matières.');
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div>
      <h3>Liste des Matières</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {subjects.length === 0 ? (
          <li>Aucune matière trouvée</li>
        ) : (
          subjects.map((subject) => (
            <li key={subject.id}>{subject.name}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SubjectList;
