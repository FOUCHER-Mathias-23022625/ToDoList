import { useState, useEffect } from 'react';
import TaskItem from '../TaskItem/TaskItem';
import TaskForm from '../TaskForm/TaskForm';
import FilterBar from '../FilterBar/FilterBar';
import SortMenu from '../SortMenu/SortMenu';
import CategoryFilter from '../CategoryFilter/CategoryFilter'; 
import './List.css';

function List({ initialTasks = [], onUpdateTask }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [viewMode, setViewMode] = useState('all'); // Afficher toutes les tâches par défaut
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('dueDate');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Mise à jour quand initialTasks change (lors du chargement du backup)
    useEffect(() => {
        console.log("Initial tasks reçues:", initialTasks.length);
        setTasks(initialTasks);
    }, [initialTasks]);

    //tri des tâches
    const getFilteredAndSortedTasks = () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Créer une copie pour éviter de modifier l'original
        let filtered = [...tasks];
        console.log("Nombre total de tâches:", filtered.length);

        filtered = filtered.filter(task => {
            // Filtre par statut (toutes ou en cours)
            if (viewMode === 'inProgress' && task.done) {
                console.log(`Tâche ${task.title} filtrée: elle est marquée comme terminée`);
                return false;
            }
            // Filtre par terme de recherche
            if (searchTerm.length >= 3 && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                console.log(`Tâche ${task.title} filtrée: ne correspond pas au terme de recherche`);
                return false;
            }

            // Filtre par catégorie sélectionnée
            if (selectedCategory && (!task.categories || !task.categories.includes(selectedCategory))) {
                console.log(`Tâche ${task.title} filtrée: ne contient pas la catégorie ${selectedCategory}`);
                return false;
            }

            return true;
        });

        console.log("Nombre de tâches après filtrage:", filtered.length);

        // Tri des tâches
        filtered.sort((a, b) => {
            // Les tâches non terminées apparaissent d'abord
            if ((a.done || false) !== (b.done || false)) {
                return (a.done || false) ? 1 : -1;
            }

            //les urgentes apparaissent en premier
            if ((a.urgent || false) !== (b.urgent || false)) {
                return (a.urgent || false) ? -1 : 1;
            }
            
            //le tri apres urgentes
            switch (sortCriteria) {
                case 'alpha':
                    return a.title.localeCompare(b.title);
                case 'creation':
                    return new Date(b.date_creation) - new Date(a.date_creation);
                case 'dueDate':
                    if (!a.date_echeance) return 1;
                    if (!b.date_echeance) return -1;
                    return new Date(a.date_echeance) - new Date(b.date_echeance);
                case 'category':
                    const catA = a.categories && a.categories.length > 0 ? a.categories[0] : '';
                    const catB = b.categories && b.categories.length > 0 ? b.categories[0] : '';
                    return catA.localeCompare(catB);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const handleSaveTask = (newTask) => {
        if (editingTask) {
            // Modification d'une tâche existante
            console.log("Mise à jour de la tâche:", editingTask.id);
            
            const updatedTask = { 
                ...editingTask, 
                ...newTask,
                // S'assurer que ces champs sont préservés/mis à jour correctement
                urgent: newTask.urgent
            };
            
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === editingTask.id ? updatedTask : task
                )
            );
            
            if (onUpdateTask) {
                onUpdateTask(updatedTask);
            }
        } else {
            //nouvelle tâche
            const taskWithId = { 
                ...newTask, 
                id: Date.now(), 
                date_creation: new Date().toISOString().split('T')[0],
                done: false
            };
            setTasks(prev => [...prev, taskWithId]);
        }
        setShowForm(false);
        setEditingTask(null);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleToggleUrgent = (taskId) => {
        setTasks(prevTasks => 
            prevTasks.map(task => {
                if (task.id === taskId) {
                    const updatedTask = { ...task, urgent: !task.urgent };
                    if (onUpdateTask) onUpdateTask(updatedTask);
                    return updatedTask;
                }
                return task;
            })
        );
    };
    
    const handleToggleDone = (taskId) => {
        setTasks(prevTasks => 
            prevTasks.map(task => {
                if (task.id === taskId) {
                    const updatedTask = { ...task, done: !task.done };
                    if (onUpdateTask) onUpdateTask(updatedTask);
                    return updatedTask;
                }
                return task;
            })
        );
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category);
    };

    const filteredTasks = getFilteredAndSortedTasks();

    return (
        <section className="List">
            <div className="ListControls">
                <button 
                    className="ViewToggle" 
                    onClick={() => setViewMode(viewMode === 'all' ? 'inProgress' : 'all')}
                >
                    {viewMode === 'all' ? 'Afficher En cours' : 'Afficher Toutes'}
                </button>
                
                <div className="SortContainer">
                    <button 
                        className="SortButton" 
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        title="Trier les tâches"
                    >
                        🔽
                    </button>
                    {showSortMenu && (
                        <SortMenu 
                            onSort={(criteria) => {
                                setSortCriteria(criteria);
                                setShowSortMenu(false);
                            }} 
                            currentSort={sortCriteria}
                        />
                    )}
                </div>
            </div>

            {selectedCategory && (
                <div className="FilterIndicator">
                    Filtre: <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory(null)}>✖</button>
                </div>
            )}

            <FilterBar onSearch={setSearchTerm} />
            <CategoryFilter 
                tasks={tasks} 
                onCategoryFilter={handleCategoryFilter}
                selectedCategory={selectedCategory}
            />

            <div className="TaskList">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onCategoryFilter={handleCategoryFilter}
                            onToggleUrgent={() => handleToggleUrgent(task.id)}
                            onToggleDone={() => handleToggleDone(task.id)}
                            onEdit={() => handleEditTask(task)}
                        />
                    ))
                ) : (
                    <div className="EmptyState">Aucune tâche à afficher</div>
                )}
            </div>

            <button className="AddTask" onClick={() => {setShowForm(true); setEditingTask(null);}}>+</button>
            {showForm && (
                <TaskForm 
                    onClose={() => {setShowForm(false); setEditingTask(null);}} 
                    onSave={handleSaveTask} 
                    task={editingTask}
                />
            )}
        </section>
    );
}

export default List;