import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start">
            <div className="container p-4">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4">
                        <h5 className="text-uppercase">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-dark">Home</Link></li>
                            <li><Link to="/about" className="text-dark">About Us</Link></li>
                            <li><Link to="/rooms" className="text-dark">Rooms</Link></li>
                            <li><Link to="/" className="text-dark">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4">
                        <h5 className="text-uppercase">Contact Us</h5>
                        <p>Email: <a href="mailto:support@nestfinder.com" className="text-dark">support@nestfinder.com</a></p>
                        <p>Phone: <a href="tel:+15551234567" className="text-dark">+(254) 1234-56789</a></p>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4">
                        <h5 className="text-uppercase">Follow Us</h5>
                        <ul className="list-unstyled">
                            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark">Facebook</a></li>
                            <li><a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-dark">WhatsApp</a></li>
                            <li><a href="https://linkedln.com" target="_blank" rel="noopener noreferrer" className="text-dark">Linkedln</a></li>
                            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark">Instagram</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center p-3 bg-light">
                <p>&copy; {new Date().getFullYear()} NestFinder. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
