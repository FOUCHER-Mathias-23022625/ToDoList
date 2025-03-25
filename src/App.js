import React, { useState } from 'react';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import List from './component/List/List';
import StartupModal from './component/StartupModal/StartupModal';
import './App.css';

function App() {
    const [showStartModal, setShowStartModal] = useState(true);
    const [tasks, setTasks] = useState([]);

    const handleLoadBackup = () => {
        try {
            // Import du fichier JSON
            const data = require('./data/data.json');
            
            // Traitement des relations pour créer les catégories dans les tâches
            const tasksWithCategories = data.taches.map(task => {
                const taskCategories = data.relations
                    .filter(rel => rel.tache === task.id)
                    .map(rel => {
                        const category = data.categories.find(cat => cat.id === rel.categorie);
                        return category ? category.title : null;
                    })
                    .filter(Boolean);
                
                return { ...task, categories: taskCategories };
            });
            
            setTasks(tasksWithCategories);
            setShowStartModal(false);
        } catch (error) {
            console.error("Erreur lors du chargement du backup:", error);
            alert("Erreur lors du chargement du backup");
        }
    };

    const handleStartEmpty = () => {
        setTasks([]);
        setShowStartModal(false);
    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    };

    return (
        <div className="App">
            {showStartModal && (
                <StartupModal 
                    onLoadBackup={handleLoadBackup} 
                    onStartEmpty={handleStartEmpty} 
                />
            )}
            <Header />
            <List initialTasks={tasks} onUpdateTask={handleUpdateTask} />
            <Footer />
        </div>
    );
}

export default App;