import React from 'react';
import './StartupModal.css';

function StartupModal({ onLoadBackup, onStartEmpty }) {
    return (
        <div className="StartupModal">
            <div className="StartupModalContent">
                <h2>Bienvenue dans ToDo</h2>
                <p>Choisissez comment vous souhaitez commencer</p>
                <div className="StartupButtons">
                    <button onClick={onLoadBackup}>📂 Charger un backup (JSON)</button>
                    <button onClick={onStartEmpty}>🆕 Commencer avec une liste vide</button>
                </div>
            </div>
        </div>
    );
}

export default StartupModal;