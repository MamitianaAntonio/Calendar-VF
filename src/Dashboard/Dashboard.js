// Dashboard.js
import React from 'react';
import style from '../Dashboard/Dashboard.module.css';
import { Link, Route, Routes } from 'react-router-dom';
import CourForm from './Link/CourForm';
import ReunionForm from './Link/ReunionForm';
import Admin from './Link/Admin';
import Calendar from '../components/Calendar';


function Dashboard() {
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
            <h1>Votre calendrier</h1>
            <div className={style.calendar}>
                <Calendar/>
            </div>
        </div>
        

        <Routes>
            <Route path="/cour" element={<CourForm />} />
            <Route path="/reunion" element={<ReunionForm />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    </>
    
  );
}

export default Dashboard;
