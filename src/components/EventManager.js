// EventManager.js
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Assurez-vous que le chemin est correct

const EventManager = ({ session, selectedProfessors, selectedSubjects }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [start, setStart] = useState(new Date().toISOString().slice(0, 16)); // Format ISO pour datetime-local
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 16)); // Format ISO pour datetime-local

  const createCalendarEvent = async () => {
    if (!eventName || !eventDescription) {
      alert("Veuillez remplir tous les détails de l'événement.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    if (!session || !session.provider_token) {
      alert("Aucune session valide ou token d'accès trouvé.");
      console.log('Session:', session);
      console.log('Token d\'accès:', session?.provider_token);
      return;
    }

    const duration = (new Date(end) - new Date(start)) / (1000 * 60 * 60); // Durée en heures
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const year = startDate.getFullYear();
    const week = Math.ceil((startDate.getDate() - startDate.getDay() + 1) / 7);
    const month = startDate.getMonth() + 1;

    const event = {
      summary: eventName,
      description: `${eventDescription}\n\nMatières : ${selectedSubjects.join(', ')}`,
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      attendees: selectedProfessors.map(email => ({ email }))
    };

    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Données d\'erreur:', errorData);
        throw new Error(`Échec de la création de l'événement : ${errorData.error.message}`);
      }

      const data = await response.json();
      console.log(data);
      alert("Événement créé, vérifiez votre Google Calendar !");

      for (const email of selectedProfessors) {
        await updateAggregatedHours('daily_hours', { professor_email: email, date: startDate.toISOString().slice(0, 10), total_hours: duration });
        await updateAggregatedHours('weekly_hours', { professor_email: email, year, week, total_hours: duration });
        await updateAggregatedHours('monthly_hours', { professor_email: email, year, month, total_hours: duration });
      }
    } catch (error) {
      alert(`Erreur lors de la création de l'événement : ${error.message}`);
      console.error(error);
    }
  };

  const updateAggregatedHours = async (tableName, entry) => {
    const { data, error } = await supabase
      .from(tableName)
      .upsert({
        ...entry,
        total_hours: (await getCurrentTotalHours(tableName, entry)) + entry.total_hours
      }, { onConflict: Object.keys(entry) });

    if (error) {
      console.error(`Erreur de mise à jour des heures pour ${tableName}:`, error);
    }
  };

  const getCurrentTotalHours = async (tableName, entry) => {
    const { data, error } = await supabase
      .from(tableName)
      .select('total_hours')
      .eq('professor_email', entry.professor_email)
      .eq('year', entry.year)
      .eq('week', entry.week)
      .eq('month', entry.month)
      .eq('date', entry.date)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`Erreur de récupération des heures pour ${tableName}:`, error);
      return 0;
    }

    return data?.total_hours || 0;
  };

  return (
    <div>
      <h3>Créer un événement</h3>
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Nom de l'événement"
      />
      <input
        type="text"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        placeholder="Description de l'événement"
      />
      <button onClick={createCalendarEvent}>Créer l'événement</button>
    </div>
  );
};

export default EventManager;
