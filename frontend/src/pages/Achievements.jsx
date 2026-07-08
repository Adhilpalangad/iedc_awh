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
              <div className="empty-icon">🏆</div>
              <h4>No Achievements Recorded Yet</h4>
              <p>Our achievements log is currently empty. Check back soon for updates on our latest milestones!</p>
            </div>
          ) : (
            <div className="ach-grid" style={{ maxWidth: '100%' }}>
              {achievements.map((ach) => (
                <div className="ach-card" key={ach.id}>
                  <div className="ach-img">
                    <img src={ach.image} alt={ach.title} />
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

export default Achievements;
