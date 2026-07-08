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
                <div className="con-icon">📍</div>
                <div className="con-it">
                  <strong>Address</strong>
                  <span>AWH Engineering College, Kuttikkattoor<br/>Kozhikode, Kerala — 673008</span>
                </div>
              </div>
              
              <div className="con-item">
                <div className="con-icon">✉️</div>
                <div className="con-it">
                  <strong>Email</strong>
                  <a href="mailto:iedcawh@gmail.com">iedcawh@gmail.com</a>
                </div>
              </div>
              
              <div className="con-item">
                <div className="con-icon">📞</div>
                <div className="con-it" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <strong>Phone</strong>
                  <a href="tel:+919947713739">+91 99477 13739</a>
                  <a href="tel:+918606540566">+91 86065 40566</a>
                </div>
              </div>
              
              <div className="con-item">
                <div className="con-icon">🕐</div>
                <div className="con-it">
                  <strong>Working Hours</strong>
                  <span>Mon – Fri, 9:00 AM – 5:00 PM</span>
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--fh)', fontWeight: 700, marginTop: '2.25rem', marginBottom: '0.9rem', fontSize: '0.95rem' }}>
                Important Links
              </h4>
              
              <div className="qlinks">
                <a href="https://awhengg.org" target="_blank" rel="noopener noreferrer" className="ql">🏫 AWH Engineering College</a>
                <a href="https://iedc.startupmission.in" target="_blank" rel="noopener noreferrer" className="ql">🚀 IEDC Kerala</a>
                <a href="https://startupmission.kerala.gov.in" target="_blank" rel="noopener noreferrer" className="ql">⚡ Kerala Startup Mission</a>
                <a href="https://iedc.startupmission.in/activitycalendar" target="_blank" rel="noopener noreferrer" className="ql">📅 IEDC Activity Calendar</a>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="con-form">
              {submitSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'fadeSlideIn 0.4s ease' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
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
