import React from 'react';
import styles from './styles.module.css'; // Assuming the styles are in a CSS module

function Main() {
        return (
            <div className='home-container'>
                <h2 className='welcome-text'>Bienvenu dans <span className='calendar-effect'>Calendar</span></h2>
                <h3 className={styles.message}>"Planifiez, organisez et rassurez l'emploi de temps"</h3>
                <button className={styles.btn}>Se connecter avec Google</button>
                <div className={styles.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h3 className={styles.copyright}>©copyright  Par  SyncFusion</h3>
            </div>
        );
}
export default Main;
