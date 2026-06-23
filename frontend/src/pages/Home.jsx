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
            <span className="vml" onClick={() => navigate('/about')}>
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
                  <a href={member.linkedin} className="tc-li" target="_blank" rel="noopener noreferrer">in</a>
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
            <div className="cta-socials">
              <a href="#" title="Instagram">📷</a>
              <a href="#" title="LinkedIn">💼</a>
              <a href="#" title="GitHub">💻</a>
              <a href="#" title="YouTube">📺</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
