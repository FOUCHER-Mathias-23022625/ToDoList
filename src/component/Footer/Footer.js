import './Footer.css';

function Footer() {
    return (
        <footer className="Footer">
            <div className="FooterContent">
                <p>ToDo List App &copy; {new Date().getFullYear()} By Mathias Foucher</p>
                <div className="FooterLinks">
                    <a href="#">À propos</a>
                    <a href="#">Confidentialité</a>
                    <a href="#">Contact</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;