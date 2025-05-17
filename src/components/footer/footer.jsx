import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} Artheca — Tous droits réservés</p>
        </footer>
    );
};

export default Footer;
