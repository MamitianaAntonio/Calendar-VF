import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function SelectLocation({ onSelect, onRemove }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*');
      if (error) {
        console.error('Erreur de récupération des lieux:', error);
        return;
      }
      setLocations(data.map(loc => loc.name));
    };

    fetchLocations();
  }, []);

  const handleAddLocation = async () => {
    if (newLocation.trim() === "" || locations.includes(newLocation.trim())) {
      alert("Le lieu est vide ou déjà ajouté.");
      return;
    }

    const { error } = await supabase
      .from('locations')
      .insert([{ name: newLocation.trim() }]);

    if (error) {
      console.error('Erreur d\'ajout du lieu:', error);
      return;
    }

    setLocations(prevLocations => [...prevLocations, newLocation.trim()]);
    setNewLocation(""); 
  };

  const handleChange = (e) => {
    setSelectedLocation(e.target.value);
    onSelect(e.target.value); // Passer la valeur sélectionnée à la fonction onSelect
  };

  const handleRemoveSelected = async () => {
    if (!selectedLocation) return;

    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('name', selectedLocation);

    if (error) {
      console.error('Erreur de suppression du lieu:', error);
      return;
    }

    setLocations(prevLocations => prevLocations.filter(loc => loc !== selectedLocation));
    setSelectedLocation("");
    onRemove(selectedLocation); 
  };

  useEffect(() => {
    onSelect(selectedLocation); 
  }, [selectedLocation, onSelect]);

  return (
    <div>
      <h3>Sélectionner un lieu</h3>
      <select value={selectedLocation} onChange={handleChange}>
        <option value="">Sélectionnez un lieu</option>
        {locations.map(location => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
        <option value="Autre">Autre</option>
      </select>
      {selectedLocation === "Autre" && (
        <>
          <input
            type="text"
            placeholder="Entrez le lieu"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <button onClick={handleAddLocation}>Ajouter</button>
        </>
      )}
      <button onClick={handleRemoveSelected} disabled={!selectedLocation}>
        Supprimer le lieu sélectionné
      </button>
    </div>
  );
}

export default SelectLocation;
