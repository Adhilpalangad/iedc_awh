import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/db';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedReportId, setExpandedReportId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await database.getEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on active tab and search query
  const filteredEvents = events.filter(ev => {
    const isTabMatch = activeTab === 'upcoming' ? ev.isUpcoming : !ev.isUpcoming;
    const isSearchMatch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.category.toLowerCase().includes(searchQuery.toLowerCase());
    return isTabMatch && isSearchMatch;
  });

  const toggleReport = (id) => {
    if (expandedReportId === id) {
      setExpandedReportId(null);
    } else {
      setExpandedReportId(id);
    }
  };

  return (
    <div className="page active" id="page-events" style={{ paddingTop: '60px' }}>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> › Events
        </div>
        <h1>Our <span className="accent">Events</span></h1>
        <p>From hackathons and bootcamps to founder talks — everything happening at IEDC AWH.</p>
      </div>

      <section className="section">
        <div className="container">
          {/* TABS & SEARCH BAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', marginBottom: '3rem' }}>
            <div className="ev-tabs">
              <button 
                className={`ev-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => { setActiveTab('upcoming'); setExpandedReportId(null); }}
              >
                Upcoming Events
              </button>
              <button 
                className={`ev-tab ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => { setActiveTab('past'); setExpandedReportId(null); }}
              >
                Past Events
              </button>
            </div>

            <div className="fg" style={{ width: '100%', maxWidth: '500px', marginBottom: 0 }}>
              <input 
                type="text" 
                placeholder="Search events by name, description or type..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r)',
                  color: 'var(--white)',
                  padding: '0.8rem 1.2rem',
                  outline: 'none',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          {/* EVENTS DISPLAY */}
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Loading events data...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h4>No Events Found</h4>
              <p>No events match your criteria or search query. Try typing another term or check the other tab!</p>
            </div>
          ) : (
            <div className="ev-grid">
              {filteredEvents.map((ev) => (
                <div className={`ev-card ${ev.isUpcoming ? 'upcoming' : 'past'}`} key={ev.id}>
                  <div className="ev-img">
                    <img src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'} alt={ev.title}/>
                    <span className={`ev-badge ${
                      ev.category === 'hackathon' ? 'bg-hack' :
                      ev.category === 'bootcamp' ? 'bg-boot' :
                      ev.category === 'talk' ? 'bg-talk' :
                      ev.category === 'workshop' ? 'bg-work' : 'bg-idea'
                    }`}>
                      {ev.category}
                    </span>
                  </div>
                  
                  <div className="ev-body">
                    <h3>{ev.title}</h3>
                    <p className="ev-meta">📅 {ev.date} · {ev.location}</p>
                    <p className="ev-desc">{ev.description}</p>
                    
                    {ev.isUpcoming ? (
                      ev.registrationUrl ? (
                        <a href={ev.registrationUrl} target="_blank" rel="noopener noreferrer" className="ev-btn">
                          Register Now
                        </a>
                      ) : (
                        <button className="ev-btn" onClick={() => navigate('/contact', { state: { subject: 'Event Collaboration', message: `Interested in event: ${ev.title}` } })}>
                          Inquire Details
                        </button>
                      )
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <span className="ev-done">Completed</span>
                        {ev.eventReport && (
                          <>
                            <span className="ev-report" onClick={() => toggleReport(ev.id)}>
                              📄 {expandedReportId === ev.id ? 'Hide Event Report' : 'View Event Report →'}
                            </span>
                            {expandedReportId === ev.id && (
                              <div style={{
                                marginTop: '0.75rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderLeft: '3px solid var(--blue)',
                                borderRadius: '4px',
                                fontSize: '0.82rem',
                                color: 'rgba(238,242,255,0.8)',
                                lineHeight: '1.5',
                                animation: 'fadeSlideIn 0.3s ease'
                              }}>
                                <strong>Event Recap:</strong><br/>
                                {ev.eventReport}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
