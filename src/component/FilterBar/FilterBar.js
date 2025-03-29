import { useState } from 'react';
import './FilterBar.css';

function FilterBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length >= 3) {
            onSearch(value);
        } else if (value.length === 0) {
            // reset quand on supprime la barre de recherche
            onSearch('');
        }
    };

    return (
        <div className="FilterBar">
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={handleSearch} />
        </div>
    );
}

export default FilterBar;