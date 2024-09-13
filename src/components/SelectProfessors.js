// src/components/SelectProfessors.js
import styles from '../components/styles/location.module.css';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SelectProfessors = ({ onSelect, onRemove }) => {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessors, setSelectedProfessors] = useState([]);
  const [hoursData, setHoursData] = useState({});

  useEffect(() => {
    // Fetch the list of professors
    const fetchProfessors = async () => {
      const { data, error } = await supabase
        .from('professors')
        .select('*');
      if (error) {
        console.error('Erreur de récupération des professeurs:', error);
        return;
      }
      setProfessors(data);
    };

    fetchProfessors();
  }, []);

  useEffect(() => {
    // Fetch the hours data
    const fetchHoursData = async () => {
      try {
        const { data: hoursData, error } = await supabase
          .from('hours')
          .select('professor_email, total_hours');

        if (error) {
          throw new Error('Erreur de récupération des heures totales : ' + error.message);
        }

        // Transform hours data into a map for easier access
        const hoursMap = hoursData.reduce((acc, { professor_email, total_hours }) => {
          acc[professor_email] = (acc[professor_email] || 0) + total_hours;
          return acc;
        }, {});
        
        setHoursData(hoursMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des heures totales :', error);
      }
    };

    fetchHoursData();
  }, []);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    setSelectedProfessors((prev) =>
      checked ? [...prev, value] : prev.filter((email) => email !== value)
    );
  };

  const handleRemoveSelected = async () => {
    const { error } = await supabase
      .from('professors')
      .delete()
      .in('email', selectedProfessors);

    if (error) {
      console.error('Erreur de suppression des professeurs:', error);
      return;
    }

    setProfessors(profs => profs.filter(prof => !selectedProfessors.includes(prof.email)));
    setSelectedProfessors([]);
    onRemove(selectedProfessors);
  };

  useEffect(() => {
    onSelect(selectedProfessors);
  }, [selectedProfessors, onSelect]);

  const handleShowTotalHours = (email) => {
    const totalHours = hoursData[email] || 0;
    alert(`Total des heures pour ${email} : ${totalHours} heures`);
  };



  return (
    <div className={styles.content}>
      <h3 className={styles.txt}>Sélectionner des professeurs</h3>
      {professors.map((professor) => (
        <div key={professor.email}>
          <label>
            <input
              type="checkbox"
              value={professor.email}
              checked={selectedProfessors.includes(professor.email)}
              onChange={handleChange}
            />
            {professor.name} {/* - {hoursData[professor.email] ? `${hoursData[professor.email]} heures` : "Aucune heure" */}
          </label>
        </div>
      ))}
      <button onClick={handleRemoveSelected} disabled={selectedProfessors.length === 0}>
        Supprimer
      </button>
      
    </div>
  );
}

export default SelectProfessors;
