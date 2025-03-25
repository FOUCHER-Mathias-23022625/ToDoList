import './SortMenu.css';

function SortMenu({ onSort, currentSort }) {
    return (
        <div className="SortMenu">
            <button 
                className={currentSort === 'alpha' ? 'active' : ''} 
                onClick={() => onSort('alpha')}
            >
                Alphabétique
            </button>
            <button 
                className={currentSort === 'creation' ? 'active' : ''} 
                onClick={() => onSort('creation')}
            >
                Date de création
            </button>
            <button 
                className={currentSort === 'dueDate' ? 'active' : ''} 
                onClick={() => onSort('dueDate')}
            >
                Échéance
            </button>
            <button 
                className={currentSort === 'category' ? 'active' : ''} 
                onClick={() => onSort('category')}
            >
                Catégorie
            </button>
        </div>
    );
}

export default SortMenu;