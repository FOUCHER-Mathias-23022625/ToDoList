import { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onCategoryFilter, onEdit, onToggleUrgent, onToggleDone }) {
    const [expanded, setExpanded] = useState(false);
    
    // Formater la date d'échéance pour un affichage plus lisible
    const formatDate = (dateString) => {
        if (!dateString) return "Non définie";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className={`Task ${task.urgent ? 'urgent' : ''} ${task.done ? 'done' : ''}`}>
            <div className="TaskHeader">
                <h3>
                    {task.title}
                    {task.urgent && <span className="UrgentBadge" title="Tâche urgente">🔥 URGENT</span>}
                    {task.done && <span className="DoneBadge" title="Tâche terminée">✓ TERMINÉE</span>}
                </h3>
                <div className="TaskActions">
                    <button 
                        className={`DoneToggle ${task.done ? 'active' : ''}`} 
                        onClick={onToggleDone}
                        title={task.done ? "Marquer comme non terminée" : "Marquer comme terminée"}
                    >
                        ✅
                    </button>
                    <button 
                        className={`UrgentToggle ${task.urgent ? 'active' : ''}`} 
                        onClick={onToggleUrgent}
                        title={task.urgent ? "Retirer l'urgence" : "Marquer comme urgent"}
                    >
                        🔥
                    </button>
                    <button 
                        className="EditButton" 
                        onClick={onEdit}
                        title="Modifier cette tâche"
                    >
                        ✏️
                    </button>
                </div>
            </div>
            
            <p className="DueDate">Échéance : {formatDate(task.date_echeance)}</p>
            
            <div className="Categories">
                {task.categories && task.categories.length > 0 ? (
                    task.categories.slice(0, expanded ? task.categories.length : 2).map((cat, index) => (
                        <span 
                            key={index} 
                            className="Category" 
                            onClick={() => onCategoryFilter(cat)}
                        >
                            {cat}
                        </span>
                    ))
                ) : (
                    <span className="NoCategory">Aucune catégorie</span>
                )}
            </div>
            
            {((task.categories && task.categories.length > 2) || task.description) && (
                <button className="ExpandButton" onClick={() => setExpanded(!expanded)}>
                    {expanded ? '▲ Moins' : '▼ Plus'}
                </button>
            )}
            
            {expanded && task.description && (
                <div className="Description">{task.description}</div>
            )}
        </div>
    );
}

export default TaskItem;