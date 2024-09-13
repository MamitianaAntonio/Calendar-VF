import React, { useEffect } from 'react';
import style from '../Dashboard/Dashboard.module.css';
import { Link, Route, Routes } from 'react-router-dom';
import CourForm from './Link/CourForm';
import ReunionForm from './Link/ReunionForm';
import Admin from './Link/Admin';
import { AuthProvider, useAuth } from '../components/AuthContext';
import plan from '../img/agenda.jpg';


function Dashboard() {

  const { setAuthToken } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAuthToken(token);
    }
  }, [setAuthToken]);

  return (
    <>
      <header className={style.header}>
        <h1 className={style.title}>Calendar</h1>
        <div className={style.navigate}>
          <ul>
            <li><Link to="/cour">Cour</Link></li>
            <li><Link to="/reunion">Réunion</Link></li>
            <li><Link to="/admin">Espace utilisateur</Link></li>
          </ul>
        </div>
      </header>

      <div className={style.body}>
        <h1 className={style.titre}>Commencez à planifier !</h1>
        <div className={style.calendar}>
          <img src={plan} alt="plan" width="600px" height="600px"/>
        </div>

        <div className={style.aide}>
          <h3>Choisissez entre "Cour" et "Reunion"</h3>
        </div>
      </div>

      
            
            <AuthProvider>
                <Routes>
                    <Route path="/cour" element={<CourForm />} />
                    <Route path="/reunion" element={<ReunionForm />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </AuthProvider>
    </>
        
  );
}

export default Dashboard;
