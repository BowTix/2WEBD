import { Link } from 'react-router-dom';
import './header.css';
import SearchBar from '../searchBar/searchBar';
import logo from '../../assets/Logo.png';

const Header = () => {
    return (
        <header className="header">
            <Link to="/" className="header-left">
                <img src={logo} alt="Logo Artheca" className="header-logo" />
                <h1 className="header-title">Artheca</h1>
            </Link>
            <SearchBar />
        </header>
    );
};

export default Header;
