import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => handleNavClick('/')} style={{ cursor: 'pointer' }}>
              <img 
                src="/logo-dark.png" 
                alt="IEDC AWH Logo" 
              />
            </div>
            <p>Innovating the future, one idea at a time.</p>
            <div className="fsocs">
              <span className="fsoc">Ig</span>
              <span className="fsoc">Li</span>
              <span className="fsoc">Gh</span>
              <span className="fsoc">Yt</span>
            </div>
          </div>
          
          <div className="fc">
            <h4>Navigation</h4>
            <span onClick={() => handleNavClick('/')}>Home</span>
            <span onClick={() => handleNavClick('/about')}>About</span>
            <span onClick={() => handleNavClick('/events')}>Events</span>
            <span onClick={() => handleNavClick('/team')}>Team</span>
            <span onClick={() => handleNavClick('/gallery')}>Gallery</span>
            <span onClick={() => handleNavClick('/contact')}>Contact</span>
          </div>

          <div className="fc">
            <h4>Quick Links</h4>
            <a href="https://iedc.startupmission.in" target="_blank" rel="noopener noreferrer">IEDC Kerala</a>
            <a href="https://startupmission.kerala.gov.in" target="_blank" rel="noopener noreferrer">Kerala Startup Mission</a>
            <a href="https://awhengg.org" target="_blank" rel="noopener noreferrer">AWH Engineering College</a>
            <a href="https://iedc.startupmission.in/activitycalendar" target="_blank" rel="noopener noreferrer">IEDC Activity Calendar</a>
          </div>

          <div className="fc">
            <h4>Contact Us</h4>
            <p>AWH Engineering College<br/>Kuttikkattoor, Kozhikode<br/>Kerala — 673008</p>
            <a href="mailto:iedcawh@gmail.com">iedcawh@gmail.com</a>
            <a href="tel:+919947713739">+91 99477 13739</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          © {new Date().getFullYear()} IEDC AWH Engineering College · A flagship initiative of Kerala Startup Mission (KSUM), Government of Kerala
        </div>
      </div>
    </footer>
  );
};

export default Footer;
