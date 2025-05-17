import './header.css';
import SearchBar from '../searchBar/searchBar';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <img src="/src/assets/Logo.png" alt="Logo Artheca" className="header-logo" />
                <h1 className="header-title">Artheca</h1>
            </div>
            <SearchBar />
        </header>
    );
};

export default Header;
