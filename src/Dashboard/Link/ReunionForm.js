import styles from './Cour.module.css';
import AddProfessor from "../../components/Addprofessor";
import AddSubject from "../../components/AddSubject";
import React, { useState, useEffect } from 'react';
import SelectProfessors from "../../components/SelectProfessors";
import SelectSubject from "../../components/SelectSubjects";
import SelectLocation from '../../components/SelectLocation';
import { supabase } from "../../lib/supabaseClient";
import { useSession } from '@supabase/auth-helpers-react';
import AddLocation from '../../components/AddLocation';
import { useAuth } from '../../components/AuthContext';
import reunion from '../../img/reunion.jpg';

function CourForm() {
  const session = useSession();
  const [accessToken, setAccessToken] = useState(null);

  const [reloadData, setReloadData] = useState(false);
  const [selectedProfessors, setSelectedProfessors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [start, setStart] = useState(new Date().toISOString().slice(0, 16));
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 16));
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);
  const [eventDescription, setEventDescription] = useState("");
  const [totalHours, setTotalHours] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const {authToken, providerToken} = useAuth();

  useEffect(() => {
    const getAccessToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        return;
      }
      setAccessToken(data.session.access_token);
    };

    getAccessToken();
  }, []);

  // Demande de permission pour les notifications
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Fonction pour supprimer un professeur sélectionné
  const handleRemoveProfessor = (email) => {
    setSelectedProfessors(selectedProfessors.filter(prof => prof !== email));
  };

  // Fonction pour afficher les heures totales d'un professeur
/*   const handleShowTotalHours = (email) => {
    const { start, end } = getPeriodDates('month');
    const hours = calculateTotalHours([email], { start, end });
    setTotalHours(hours);
  }; */

  const handleSubjectAdded = () => setReloadData(prev => !prev);
  const handleProfessorAdded = () => setReloadData(prev => !prev);

  // Fonction pour supprimer un sujet sélectionné
  const handleRemoveSubject = (subject) => {
    setSelectedSubjects(selectedSubjects.filter(subj => subj !== subject));
  };

  // Fonction pour obtenir les dates de la période sélectionnée
  const getPeriodDates = (period) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (period) {
      case 'month':
        start.setDate(1);
        end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - now.getDay());
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case 'day':
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'year':
        start.setMonth(0, 1);
        end = new Date(start.getFullYear() + 1, 0, 0);
        break;
      default:
        break;
    }
    return { start: start.toISOString(), end: end.toISOString() };
  };

  // Fonction pour afficher une notification
  const showNotification = (event) => {
    if (Notification.permission === 'granted') {
      const startDate = new Date(event.start.dateTime).toLocaleString();
      const endDate = new Date(event.end.dateTime).toLocaleString();
      new Notification("Événement Créé", {
        body: `Événement : ${event.summary}\nLieu : ${event.location}\nDescription : ${event.description}\nDébut : ${startDate}\nFin : ${endDate}`,
      });
    }
  };

  // Fonction
  const createCalendarEvent = async () => {
    if (!eventName || !eventDescription || !selectedLocation) {
      alert("Veuillez remplir tous les détails de l'événement.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    if (!session || !session.provider_token) {
      alert("Aucune session valide ou token d'accès trouvé.");
      return;
    }

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
      location: selectedLocation,
      attendees: selectedProfessors.map(email => ({ email }))
    };
    

    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${providerToken}`, // Utilisez providerToken pour l'authentification
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Échec de la création de l'événement : ${errorData.error.message}`);
      }

      const data = await response.json();
      alert("Événement créé, vérifiez votre Google Calendar !");

      const newEvent = {
        id: data.id,
        summary: eventName,
        description: eventDescription,
        start: { dateTime: start },
        end: { dateTime: end },
        location: selectedLocation,
        attendees: selectedProfessors
      };

      setEvents(prevEvents => [...prevEvents, newEvent]);

      showNotification(newEvent);
    } catch (error) {
      alert(`Erreur lors de la création de l'événement : ${error.message}`);
    }
  };
  
  

  return (
    <>
      <h1 className={styles.title}>Formulaire de réunion</h1>

      <div className={styles.Ensemble}>
        <div className={styles.AjouterCours}>
          <h2>Ajouter</h2>
          <AddLocation
            onSelect={setSelectedLocation}
            onRemove={(location) => {
              if (selectedLocation === location) {
                setSelectedLocation("");
              }
            }}
          />
        </div>

        <div className={styles.Cour}>
          <h2 className={styles.plan}>Planifiez les cours</h2>
          {/* sélection des lieux */}
          <SelectLocation
            onSelect={setSelectedLocation}
            onRemove={(location) => {
              if (selectedLocation === location) {
                setSelectedLocation("");
              }
            }}
          />
          {/* ajout horaire */}
          <div className={styles['form-group']}>
            <label htmlFor="start">Début du réunion</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor='end'>Fin du réunion</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          {/* nom de l'événement */}
          <p>Sujet</p>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          {/* description */}
          <p>Description du réunion</p>
          <textarea
            className={styles.eventDescription}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />

          <br/>
          {/* bouton d'ajout */}
          <button onClick={createCalendarEvent}>Créer la réunion</button>
        </div>
        

        {/* montre */}
        <div className={styles.montre}>
           <img src={reunion} alt="reunion" width="200px" height="200px"/>
        </div>
      </div>
    </>
  );
}

export default CourForm;
