import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <p>Copyright © Playlister {currentYear}</p>
        </footer>
    );
};

export default Footer;