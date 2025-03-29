import { useState, useEffect } from 'react';
import './CategoryFilter.css';

function CategoryFilter({ tasks, onCategoryFilter, selectedCategory }) {
    const [categories, setCategories] = useState([]);
    
    // Extraire toutes les catégories uniques des tâches
    useEffect(() => {
        if (tasks && tasks.length > 0) {
            const allCategories = tasks
                .flatMap(task => task.categories || [])
                .filter(Boolean);
            
            // Éliminer les doublons
            const uniqueCategories = [...new Set(allCategories)].sort();
            setCategories(uniqueCategories);
        }
    }, [tasks]);
    
    return (
        <div className="CategoryFilter">
            <label>Catégories:</label>
            <div className="CategoryChips">
                {categories.length > 0 ? (
                    categories.map((category, index) => (
                        <button 
                            key={index}
                            className={`CategoryChip ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => onCategoryFilter(category)}
                        >
                            {category}
                        </button>
                    ))
                ) : (
                    <span className="NoCategoriesText">Aucune catégorie disponible</span>
                )}
            </div>
        </div>
    );
}

export default CategoryFilter;