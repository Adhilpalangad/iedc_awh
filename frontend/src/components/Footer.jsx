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
            <div className="fsocs" style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
              <a href="https://www.instagram.com/iedc_awh?igsh=MW45cnc1dHM4Z29ubQ==" className="fsoc" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--muted)', transition: 'color 0.2s, border-color 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/company/iedc-awh1" className="fsoc" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--muted)', transition: 'color 0.2s, border-color 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://youtube.com/@iedcawhengg?si=JZLuGj0lVnP_p-Wn" className="fsoc" target="_blank" rel="noopener noreferrer" title="YouTube" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--muted)', transition: 'color 0.2s, border-color 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://wa.me/918606540566" className="fsoc" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--muted)', transition: 'color 0.2s, border-color 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
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
