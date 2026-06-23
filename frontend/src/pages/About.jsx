import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/db';

const About = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [generalSettings, setGeneralSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const [fetchedAlumni, fetchedAchs, fetchedSettings] = await Promise.all([
          database.getAlumni(),
          database.getAchievements(),
          database.getGeneralSettings()
        ]);
        setAlumni(fetchedAlumni);
        setAchievements(fetchedAchs);
        setGeneralSettings(fetchedSettings);
      } catch (err) {
        console.error('Error fetching about page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <div className="page active" id="page-about" style={{ paddingTop: '60px' }}>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> › About
        </div>
        <h1>About <span className="accent">IEDC AWH</span></h1>
        <p>The Innovation and Entrepreneurship Development Centre at AWH Engineering College — building Kerala's next generation of student entrepreneurs.</p>
      </div>

      {/* CORE STATEMENTS */}
      <section className="section">
        <div className="container">
          <div className="abt-cards">
            <div className="abt-card">
              <div className="abt-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>{loading ? 'Loading...' : (generalSettings?.mission || 'To cultivate an entrepreneurial mindset among students through innovation, mentorship, and resource ecosystems that transform ideas into real, scalable solutions for society.')}</p>
            </div>
            <div className="abt-card">
              <div className="abt-icon">🔭</div>
              <h3>Our Vision</h3>
              <p>{loading ? 'Loading...' : (generalSettings?.vision || 'To pioneer AWH Engineering College as the finest hub of bold innovation and the birthplace of world-class technology startups emerging from Kerala\'s academic ecosystem.')}</p>
            </div>
            <div className="abt-card">
              <div className="abt-icon">🚀</div>
              <h3>Who We Are</h3>
              <p>IEDC AWH is a flagship initiative of Kerala Startup Mission (KSUM) — one of 550+ IEDCs across Kerala — providing students with access to cutting-edge technology, mentorship and early risk capital.</p>
            </div>
          </div>

          <div className="sh" style={{ marginTop: '4rem' }}>
            <h2 className="st">Our <span className="accent">Objectives</span></h2>
            <p className="ss">What we set out to achieve every year</p>
          </div>
          
          <ul className="obj-list">
            <li>
              <span className="obj-n">01</span>
              <div>
                <strong>Technology Exposure:</strong> Create an innovation culture among students by introducing state-of-the-art technologies and positioning AWH as a Learning and Innovation Platform.
              </div>
            </li>
            <li>
              <span className="obj-n">02</span>
              <div>
                <strong>Entrepreneurship Mechanisms:</strong> Promote an innovation-driven entrepreneurship culture and develop institutional mechanisms to foster techno-entrepreneurship.
              </div>
            </li>
            <li>
              <span className="obj-n">03</span>
              <div>
                <strong>Product Commercialization:</strong> Develop and promote commercially viable innovative products and solutions built by AWH students.
              </div>
            </li>
            <li>
              <span className="obj-n">04</span>
              <div>
                <strong>Job Creation:</strong> Promote enterprise among budding technopreneurs and create employment opportunities through student-led ventures.
              </div>
            </li>
            <li>
              <span className="obj-n">05</span>
              <div>
                <strong>KSUM Connectivity:</strong> Connect students with industry mentors, investors and global networks through Kerala Startup Mission programmes.
              </div>
            </li>
            <li>
              <span className="obj-n">06</span>
              <div>
                <strong>Access to Resources:</strong> Provide access to funding, incubation support, maker space and prototyping tools to high-potential student ideas.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* KSUM AFFILIATION */}
      <section className="section about-bg">
        <div className="container">
          <div className="about-grid">
            <div>
              <h2 className="st">KSUM <span className="accent">Affiliation</span></h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.8, marginBottom: '1.4rem' }}>
                IEDC AWH is part of a network of <strong style={{ color: 'var(--white)' }}>550+ IEDCs across Kerala</strong> under Kerala Startup Mission (KSUM) — the nodal agency of the Government of Kerala for entrepreneurship development.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                KSUM provides IEDCs with access to programmes like Idea Fest, IEDC Summit, M.I.N.D mentorship, LEAP, Bootcamps and early-stage funding support.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-blue" onClick={() => window.open('https://startupmission.kerala.gov.in', '_blank')}>
                  Kerala Startup Mission ↗
                </button>
                <button className="btn btn-ghost" onClick={() => window.open('https://iedc.startupmission.in', '_blank')}>
                  IEDC Kerala ↗
                </button>
              </div>
            </div>
            <div>
              <img className="about-img" src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80" alt="KSUM"/>
              <div className="ksum-strip">
                <span className="kd">●</span>
                <span>Official Kerala Startup Mission IEDC</span>
                <span className="kl" onClick={() => window.open('https://startupmission.kerala.gov.in', '_blank')}>
                  Learn more →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALUMNI STARTUPS */}
      <section className="section">
        <div className="container">
          <div className="sh">
            <h2 className="st">Alumni <span className="accent">Entrepreneurs</span></h2>
            <p className="ss">AWH alumni who turned their ideas into real ventures</p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading alumni...</div>
          ) : alumni.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h4>No Alumni Ventures Yet</h4>
              <p>Our alumni startup directory is currently under development. Check back soon for founders' profiles!</p>
            </div>
          ) : (
            <div className="alumni-grid">
              {alumni.map((al) => (
                <div className="al-card" key={al.id}>
                  <div className="al-img">
                    <img src={al.image} alt={al.name}/>
                  </div>
                  <h4>{al.name}</h4>
                  <div className="al-startup">🚀 {al.startup}</div>
                  <p className="al-desc">{al.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ACHIEVEMENTS FULL */}
      <section className="section" style={{ background: 'var(--bg2)', paddingTop: '4rem' }}>
        <div className="container">
          <div className="sh">
            <h2 className="st">Our <span className="accent">Achievements</span></h2>
            <p className="ss">Real wins from the IEDC AWH community</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading achievements...</div>
          ) : achievements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <h4>No Achievements Recorded</h4>
              <p>Our achievements log is currently empty. Stay tuned for new milestones!</p>
            </div>
          ) : (
            <div className="ach-grid" style={{ maxWidth: '100%' }}>
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
        </div>
      </section>
    </div>
  );
};

export default About;
