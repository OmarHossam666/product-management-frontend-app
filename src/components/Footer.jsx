import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div>
          <p>© {new Date().getFullYear()} Enterprise Systems Inc. All rights reserved.</p>
        </div>
        <ul className="footer-nav">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/features" className="nav-link">Features</Link></li>
          <li><Link to="/pricing" className="nav-link">Pricing</Link></li>
          <li><Link to="/support" className="nav-link">Support</Link></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
