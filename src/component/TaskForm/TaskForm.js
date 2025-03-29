import { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onClose, onSave, task = null }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState('');
    const [description, setDescription] = useState('');
    const [urgent, setUrgent] = useState(false);

    // Pour edit 
    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDate(task.date_echeance || '');
            setCategories(task.categories ? task.categories.join(', ') : '');
            setDescription(task.description || '');
            setUrgent(task.urgent || false);
        }
    }, [task]);

    const handleSubmit = () => {
        if (title.length < 3) {
            alert('Le titre doit contenir au moins 3 caractères.');
            return;
        }
        const categoriesList = categories
            .split(',')
            .map(cat => cat.trim())
            .filter(cat => cat.length > 0);

        // Création ou mise à jour de la tâche
        const taskData = {
            ...(task && { id: task.id }),
            title, 
            date_echeance: date, 
            categories: categoriesList, 
            description,
            urgent,
            // Garder les autres propriétés si on édite une tâche existante
            ...(task && { done: task.done }),
            ...(task && { date_creation: task.date_creation }),
            ...(task && { contacts: task.contacts })
        };
        
        onSave(taskData);
    };

    return (
        <div className="Modal">
            <div className="ModalContent">
                <h2>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
                <input 
                    type="text" 
                    placeholder="Titre" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                />
                <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Catégories (séparées par des virgules)" 
                    value={categories} 
                    onChange={e => setCategories(e.target.value)} 
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                />
                
                <div className="UrgentCheckbox">
                    <input 
                        type="checkbox" 
                        id="urgent" 
                        checked={urgent} 
                        onChange={e => setUrgent(e.target.checked)} 
                    />
                    <label htmlFor="urgent">
                        <span className="CheckIcon">🔥</span>
                        Marquer comme urgent
                    </label>
                </div>
                
                <div className="ModalButtons">
                    <button onClick={handleSubmit}>{task ? 'Mettre à jour' : 'Enregistrer'}</button>
                    <button onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
}

export default TaskForm;