import './header.css';
import SearchBar from '../searchBar/searchBar';
import logo from '../../assets/Logo.png';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="Logo Artheca" className="header-logo" />
                <h1 className="header-title">Artheca</h1>
            </div>
            <SearchBar />
        </header>
    );
};

export default Header;
