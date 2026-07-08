import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/db';

const Achievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const fetchedAchs = await database.getAchievements();
        setAchievements(fetchedAchs);
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="page active" id="page-achievements" style={{ paddingTop: '60px' }}>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> › Achievements
        </div>
        <h1>Our <span className="accent">Achievements</span></h1>
        <p>Celebrating the milestones, awards, and innovations of IEDC AWH students and startups.</p>
      </div>

      {/* ACHIEVEMENTS LIST */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Loading achievements...</div>
          ) : achievements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path><path d="M12 2a5 5 0 0 0-5 5v3c0 2.76 2.24 5 5 5s5-2.24 5-5V7a5 5 0 0 0-5-5z"></path></svg>
              </div>
              <h4>No Achievements Recorded Yet</h4>
              <p>Our achievements log is currently empty. Check back soon for updates on our latest milestones!</p>
            </div>
          ) : (
            <div className="ach-grid" style={{ maxWidth: '100%' }}>
              {achievements.map((ach) => (
                <div className="ach-card" key={ach.id}>
                  <div className="ach-img">
                    <img src={ach.image} alt={ach.title} />
                    <div className="ach-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {ach.category}
                    </div>
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

export default Achievements;
