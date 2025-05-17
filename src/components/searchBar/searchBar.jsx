import { useState } from 'react';
import './searchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <form className={`search-form ${query ? 'valid' : ''}`}
              onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
              }}
              noValidate
        >
            <input type="search" placeholder="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} required />
            <FontAwesomeIcon icon={faSearch} className="fa" />
        </form>
    );
};

export default SearchBar;
