import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'; // Assurez-vous que ce chemin est correct

const ScheduleClass = () => {
  const [classes, setClasses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const supabase = useSupabaseClient();
  const session = useSession(); // Ajoutez cette ligne pour obtenir la session



  const fetchClasses = useCallback(async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*');
    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data);
    }
  }, [supabase]);

  const fetchProfessors = useCallback(async () => {
    const { data, error } = await supabase
      .from('professors')
      .select('*');
    if (error) {
      console.error('Error fetching professors:', error);
    } else {
      setProfessors(data);
    }
  }, [supabase]);

  const fetchSubjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*');
    if (error) {
      console.error('Error fetching subjects:', error);
    } else {
      setSubjects(data);
    }
  }, [supabase]);

  useEffect(() => {
    fetchClasses();
    fetchProfessors();
    fetchSubjects();
  }, [fetchClasses, fetchProfessors, fetchSubjects]);

  const handleAddClass = async () => {
    if (!selectedProfessor || !selectedSubject || !startTime || !endTime) {
      alert('Please fill in all fields.');
      return;
    }

    const duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);

    // Ajout du cours dans la base de données
    const { error } = await supabase
      .from('classes')
      .insert([{ professor_id: selectedProfessor, subject_id: selectedSubject, start_time: startTime, end_time: endTime, duration }]);

    if (error) {
      console.error('Error adding class:', error);
    } else {
      // Création d'un événement Google Calendar
      await createGoogleCalendarEvent({
        summary: `Cours: ${subjects.find(sub => sub.id === selectedSubject)?.name}`,
        description: `Professeur ID: ${selectedProfessor}, Matière ID: ${selectedSubject}`,
        start: startTime,
        end: endTime
      });
      fetchClasses(); // Rafraîchir la liste des cours
    }
  };

  const createGoogleCalendarEvent = async (event) => {
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${session?.provider_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: event.start,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: event.end,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Échec de la création de l'événement : ${errorData.error.message}`);
      }

      const data = await response.json();
      console.log('Google Calendar event created:', data);
      alert("Cours créé et ajouté à Google Calendar !");
    } catch (error) {
      alert(`Erreur lors de la création de l'événement : ${error.message}`);
      console.error(error);
    }
  };

  if (!classes || !professors || !subjects) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Planifier un réunion</h2>
      <div>
        <label>Professeur:</label>
        <select onChange={(e) => setSelectedProfessor(e.target.value)} value={selectedProfessor}>
          <option value="">Sélectionner un ou plusieur professeur</option>
          {professors.map((prof) => (
            <option key={prof.id} value={prof.id}>{prof.name}</option>
          ))}
        </select>
      </div>
      <div>
      </div>
      <div>
        <label>Début:</label>
        <input type="datetime-local" onChange={(e) => setStartTime(e.target.value)} value={startTime} />
      </div>
      <div>
        <label>Fin:</label>
        <input type="datetime-local" onChange={(e) => setEndTime(e.target.value)} value={endTime} />
      </div>
      <button onClick={handleAddClass}>Ajouter un réunion</button>
    </div>
  );
};

export default ScheduleClass;
