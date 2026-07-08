import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/db';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [coreTeam, setCoreTeam] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [generalSettings, setGeneralSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [fetchedStats, fetchedAchs, fetchedEvents, fetchedTeam, fetchedGallery, fetchedSettings] = await Promise.all([
          database.getStats(),
          database.getAchievements(),
          database.getEvents(),
          database.getTeam(),
          database.getGallery(),
          database.getGeneralSettings()
        ]);

        setStats(fetchedStats);
        setAchievements(fetchedAchs.slice(0, 2)); // Show top 2 achievements
        setGeneralSettings(fetchedSettings);
        
        // Show up to 3 upcoming events
        const upcoming = fetchedEvents
          .filter(e => e.isUpcoming)
          .slice(0, 3);
        setUpcomingEvents(upcoming);

        // Get key nodal and student leads for the core preview
        // Core team: Nodal Officer, Student Lead, Tech Lead, etc.
        const core = fetchedTeam.filter(t => 
          t.role.includes("Nodal") || 
          t.role === "Student Lead"
        ).slice(0, 3);
        setCoreTeam(core.length > 0 ? core : fetchedTeam.slice(0, 3));

        setGalleryPreview(fetchedGallery.slice(0, 4)); // Show 4 gallery items
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="page active" id="page-home" style={{ paddingTop: '60px' }}>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="bdot"></span> Supported by Kerala Startup Mission
            </div>
            <h1 className="hero-title">
              Innovate.<br/>Build.<br/><span className="accent">Launch.</span>
            </h1>
            <p className="hero-sub">
              Empowering students at AWH Engineering College to transform visionary ideas into impactful startups and sustainable solutions.
            </p>
            <div className="hero-btns">
              <button className="btn btn-blue" onClick={() => navigate('/events')}>
                Explore Events →
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/about')}>
                Know More
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80" alt="Students collaborating"/>
              <div className="hero-img-ov"></div>
            </div>
            <div className="hero-float">
              <div className="float-icon">🚀</div>
              <div>
                <div className="float-t">Next Event</div>
                <div className="float-s">{loading ? 'Loading...' : `${generalSettings?.nextEventTitle || 'HackSurface 3.0'} — ${generalSettings?.nextEventDate || 'Jan 2026'}`}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-wrap">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-num">{loading ? '...' : (stats?.totalMembers || '500+')}</div>
              <div className="stat-lbl">Total Members</div>
            </div>
            <div className="stat-div"></div>
            <div className="stat-item">
              <div className="stat-num">{loading ? '...' : (stats?.eventsConducted || '40+')}</div>
              <div className="stat-lbl">Events Conducted</div>
            </div>
            <div className="stat-div"></div>
            <div className="stat-item">
              <div className="stat-num">{loading ? '...' : (stats?.yearsOfInnovation || '8+')}</div>
              <div className="stat-lbl">Years of Innovation</div>
            </div>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <section className="section">
        <div className="container">
          <div className="sh">
            <h2 className="st">Our <span class="accent">Achievements</span></h2>
            <p className="ss">Real wins from the IEDC AWH community</p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading achievements...</div>
          ) : achievements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <h4>No Achievements Yet</h4>
              <p>Our students and teams are actively developing new projects. Check back soon for updates!</p>
            </div>
          ) : (
            <div className="ach-grid">
              {achievements.map((ach) => (
                <div className="ach-card" key={ach.id}>
                  <div className="ach-img">
                    <img src={ach.image} alt={ach.title}/>
                    <div className="ach-badge">🏆 {ach.category}</div>
                  </div>
                  <div className="ach-body">
                    <h3>{ach.title}</h3>
                    <p className="ach-meta">{ach.organizer} · {ach.date}</p>
                    <p className="ach-team">{ach.team}</p>
                    <p className="ach-desc">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="vmc">
            <span className="vml" onClick={() => navigate('/achievements')}>
              View All Achievements →
            </span>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section about-bg">
        <div className="container">
          <div className="about-grid">
            <div>
              <h2 className="st">Mission &amp; <span className="accent">Vision</span></h2>
              <div className="mv-item">
                <div className="mv-bar"></div>
                <div>
                  <h4>Our Mission</h4>
                  <p>{loading ? 'Loading...' : (generalSettings?.mission || 'To cultivate an entrepreneurial mindset among students through innovation, mentorship, and resource ecosystems that transform ideas into real scalable solutions.')}</p>
                </div>
              </div>
              <div className="mv-item">
                <div className="mv-bar"></div>
                <div>
                  <h4>Our Vision</h4>
                  <p>{loading ? 'Loading...' : (generalSettings?.vision || 'To pioneer AWH Engineering College as the finest hub of bold innovation and the birthplace of world-class technology startups in Kerala.')}</p>
                </div>
              </div>
              <button className="btn btn-blue" style={{ marginTop: '1.75rem' }} onClick={() => navigate('/about')}>
                Learn More
              </button>
            </div>
            
            <div>
              <img className="about-img" src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" alt="Innovation"/>
              <div className="ksum-strip">
                <span className="kd">●</span>
                <span>Official Kerala Startup Mission IEDC — Part of 550+ IEDC network</span>
                <span className="kl" onClick={() => window.open('https://startupmission.kerala.gov.in', '_blank')}>
                  Learn more about KSUM →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="sh-row">
            <div>
              <h2 className="st">Upcoming <span className="accent">Events</span></h2>
              <p className="ss">Highlights from our latest workshops, hackathons and talks</p>
            </div>
            <span className="vml" onClick={() => navigate('/events')}>
              View All Events →
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading events...</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h4>No Upcoming Events</h4>
              <p>We are currently mapping out our next workshops, bootcamps, and hackathons. Check back soon!</p>
            </div>
          ) : (
            <div className="ev-grid">
              {upcomingEvents.map((ev) => (
                <div className="ev-card upcoming" key={ev.id}>
                  <div className="ev-img">
                    <img src={ev.image} alt={ev.title}/>
                    <span className="ev-badge bg-hack">{ev.category}</span>
                  </div>
                  <div className="ev-body">
                    <h3>{ev.title}</h3>
                    <p className="ev-meta">📅 {ev.date} · {ev.location}</p>
                    <p className="ev-desc">{ev.description}</p>
                    {ev.registrationUrl && (
                      <a href={ev.registrationUrl} target="_blank" rel="noopener noreferrer" className="ev-btn">
                        Register Now
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GOT AN IDEA */}
      <div className="idea-wrap">
        <div className="container">
          <div className="idea-box">
            <div className="idea-pat"></div>
            <h2>Got an <span className="accent">Idea?</span></h2>
            <p>You don't need a finished product — just a spark. IEDC AWH will help you validate, build and launch it with mentorship, resources and KSUM support.</p>
            <div className="idea-feats">
              <div className="idea-feat">
                <div className="idea-icon">💡</div>
                <strong>Mentorship</strong>
                <small>Get guided by industry experts</small>
              </div>
              <div className="idea-feat">
                <div className="idea-icon">🛠️</div>
                <strong>Maker Space</strong>
                <small>Access tools and lab equipment</small>
              </div>
              <div className="idea-feat">
                <div className="idea-icon">💰</div>
                <strong>Funding Support</strong>
                <small>Connect to KSUM risk capital</small>
              </div>
            </div>
            <button className="btn btn-blue btn-lg" onClick={() => navigate('/contact', { state: { subject: 'Submit an Idea' } })}>
              Submit Your Idea
            </button>
            <span className="idea-kl" onClick={() => window.open('https://startupmission.kerala.gov.in', '_blank')}>
              Learn about KSUM support →
            </span>
          </div>
        </div>
      </div>

      {/* CORE TEAM PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="sh">
            <h2 class="st">Meet the <span className="accent">Core Team</span></h2>
            <p className="ss">Passionate minds driving innovation at AWH</p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading core team...</div>
          ) : coreTeam.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h4>Team Profiles Unavailable</h4>
              <p>Our student leaders list is currently being updated for the new academic year.</p>
            </div>
          ) : (
            <div className="team-preview">
              {coreTeam.map((member) => (
                <div className="tc" key={member.id}>
                  <div className="tc-img">
                    <img src={member.image} alt={member.name}/>
                  </div>
                  <h4>{member.name}</h4>
                  <p className="tc-role">{member.role}</p>
                  <a href={member.linkedin} className="tc-li" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              ))}
            </div>
          )}
          
          <div className="vmc" style={{ marginTop: '3rem' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/team')}>
              View Full Team →
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sh-row">
            <div>
              <h2 className="st">Snapshots of <span className="accent">Success</span></h2>
              <p className="ss">Relive the moments of innovation and collaboration</p>
            </div>
            <span className="vml" onClick={() => navigate('/gallery')}>
              View Full Gallery →
            </span>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading gallery...</div>
          ) : galleryPreview.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🖼️</div>
              <h4>No Gallery Items Found</h4>
              <p>Check back later to see snapshots of our latest events and activities.</p>
            </div>
          ) : (
            <div className="gal-preview">
              {galleryPreview.map((item, idx) => (
                <div className={`gi ${idx === 0 ? 'large' : ''}`} key={item.id}>
                  <img src={item.image} alt={item.title}/>
                  <div className="gi-ov">{item.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* READY CTA */}
      <div className="cta-wrap">
        <div className="container">
          <div className="cta-box">
            <div className="cta-dots"></div>
            <h2>Ready to build something <span className="accent">great?</span></h2>
            <p>Join the most active innovation community at AWH Engineering College. No experience required, just curiosity.</p>
            <div className="cta-btns">
              <button className="btn btn-white" onClick={() => navigate('/contact', { state: { subject: 'Join IEDC' } })}>
                Join IEDC Now
              </button>
              <button className="btn btn-ow" onClick={() => navigate('/contact')}>
                Contact Us
              </button>
            </div>
            <div className="cta-socials" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <a href="https://www.instagram.com/iedc_awh?igsh=MW45cnc1dHM4Z29ubQ==" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', transition: 'background-color 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/company/iedc-awh1" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', transition: 'background-color 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://youtube.com/@iedcawhengg?si=JZLuGj0lVnP_p-Wn" target="_blank" rel="noopener noreferrer" title="YouTube" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', transition: 'background-color 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://wa.me/918606540566" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', transition: 'background-color 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
