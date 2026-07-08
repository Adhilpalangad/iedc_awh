import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { database } from '../services/db';

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pick up subject parameter if coming from "Submit Your Idea" or "Join IEDC" CTAs
  const initialSubject = location.state?.subject || '';
  const initialMessage = location.state?.message || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    college: '',
    message: initialMessage
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Your name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Please type a message';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await database.addSubmission(formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        college: '',
        message: ''
      });
    } catch (err) {
      console.error('Failed to submit message:', err);
      setErrors({ global: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page active" id="page-contact" style={{ paddingTop: '60px' }}>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> › Contact
        </div>
        <h1>Get in <span className="accent">Touch</span></h1>
        <p>Have an idea, a question or want to collaborate? We'd love to hear from you.</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="con-grid">
            {/* CONTACT INFO */}
            <div className="con-info">
              <h3>Let's build something <span className="accent">great</span> together</h3>
              <p>Whether you want to join IEDC, submit an idea, collaborate on a project or just say hello — reach out and we'll get back to you.</p>
              
              <div className="con-item">
                <div className="con-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--blue)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="con-it">
                  <strong>Address</strong>
                  <span>AWH Engineering College, Kuttikkattoor<br/>Kozhikode, Kerala — 673008</span>
                </div>
              </div>
              
              <div className="con-item">
                <div className="con-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--blue)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div className="con-it">
                  <strong>Email</strong>
                  <a href="mailto:iedcawh@gmail.com">iedcawh@gmail.com</a>
                </div>
              </div>
              
              <div className="con-item">
                <div className="con-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--blue)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div className="con-it" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <strong>Phone</strong>
                  <a href="tel:+919947713739">+91 99477 13739</a>
                  <a href="tel:+918606540566">+91 86065 40566</a>
                </div>
              </div>
              
              <div className="con-item">
                <div className="con-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--blue)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div className="con-it">
                  <strong>Working Hours</strong>
                  <span>Mon – Fri, 9:00 AM – 5:00 PM</span>
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--fh)', fontWeight: 700, marginTop: '2.25rem', marginBottom: '0.9rem', fontSize: '0.95rem' }}>
                Important Links
              </h4>
              
              <div className="qlinks">
                <a href="https://awhengg.org" target="_blank" rel="noopener noreferrer" className="ql" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--blue)' }}><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
                  AWH Engineering College
                </a>
                <a href="https://iedc.startupmission.in" target="_blank" rel="noopener noreferrer" className="ql" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--blue)' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  IEDC Kerala
                </a>
                <a href="https://startupmission.kerala.gov.in" target="_blank" rel="noopener noreferrer" className="ql" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--blue)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Kerala Startup Mission
                </a>
                <a href="https://iedc.startupmission.in/activitycalendar" target="_blank" rel="noopener noreferrer" className="ql" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--blue)' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  IEDC Activity Calendar
                </a>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="con-form">
              {submitSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'fadeSlideIn 0.4s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--blue)' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Thank you for contacting IEDC AWH. We have successfully received your inquiry and our team will get back to you within 24–48 hours.
                  </p>
                  <button className="btn btn-blue" onClick={() => setSubmitSuccess(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Send us a Message</h3>
                  
                  {errors.global && (
                    <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '1rem' }}>{errors.global}</p>
                  )}

                  <div className="fg-row">
                    <div className="fg">
                      <label>Your Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                      />
                      {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.name}</p>}
                    </div>
                    
                    <div className="fg">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.email}</p>}
                    </div>
                  </div>

                  <div className="fg">
                    <label>Subject *</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? 'error' : ''}
                    >
                      <option value="">Select a subject</option>
                      <option value="Join IEDC">Join IEDC</option>
                      <option value="Submit an Idea">Submit an Idea</option>
                      <option value="Event Collaboration">Event Collaboration</option>
                      <option value="Sponsorship">Sponsorship</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                    {errors.subject && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.subject}</p>}
                  </div>

                  <div className="fg">
                    <label>College / Department</label>
                    <input 
                      type="text" 
                      name="college"
                      placeholder="e.g. AWH Engineering College, S5 CSE"
                      value={formData.college}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="fg">
                    <label>Message *</label>
                    <textarea 
                      name="message"
                      placeholder="Tell us about your idea or query..."
                      value={formData.message}
                      onChange={handleChange}
                      className={errors.message ? 'error' : ''}
                    ></textarea>
                    {errors.message && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.message}</p>}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-blue" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message →'}
                  </button>
                  
                  <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1rem', textAlign: 'center' }}>
                    We usually respond within 24–48 hours on working days.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
