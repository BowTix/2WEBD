import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} SupKnowledge - MetMuseum API</p>
        </footer>
    );
};

export default Footer;
