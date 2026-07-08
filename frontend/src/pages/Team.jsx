import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/db';

const Team = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [loading, setLoading] = useState(true);

  // Available academic years for Execom history
  const years = ['2026', '2025', '2024'];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const fetchedTeam = await database.getTeam();
        setTeam(fetchedTeam);
      } catch (err) {
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Filter team members
  const facultyList = team.filter(member => member.year === 'Faculty');
  const execomList = team.filter(member => member.year === selectedYear);

  return (
    <div className="page active" id="page-team" style={{ paddingTop: '60px' }}>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> › Team
        </div>
        <h1>Meet the <span className="accent">Team</span></h1>
        <p>Faculty coordinators, student leaders and execom members driving innovation at AWH every day.</p>
      </div>

      <section className="section">
        <div className="container">
          {/* FACULTY SECTION */}
          <p className="tsec-title">Faculty Advisory</p>
           {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '4rem' }}>Loading Faculty...</div>
          ) : facultyList.length === 0 ? (
            <div className="empty-state" style={{ marginBottom: '4rem' }}>
              <div className="empty-icon">👥</div>
              <h4>No Faculty Advisory listed</h4>
              <p>We are currently updating our advisory board member profiles. Please check back later.</p>
            </div>
          ) : (
            <div className="faculty-grid">
              {facultyList.map((faculty) => (
                <div className="tfc" key={faculty.id}>
                  <div className="tc-img">
                    <img src={faculty.image} alt={faculty.name} />
                  </div>
                  <h4>{faculty.name}</h4>
                  <p className="tc-role">{faculty.role}</p>
                  <p className="tfc-dept">{faculty.department}</p>
                  <a href={faculty.linkedin} className="tc-li" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* EXECOM TIMELINE */}
          <p className="tsec-title">Execom Through the Years</p>
          
          <div className="timeline-wrap">
            <div className="timeline-track">
              {years.map((year) => (
                <div 
                  key={year}
                  className={`tl-item ${selectedYear === year ? 'active' : ''} ${year === '2024' ? 'founding' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  <div className="tl-badge">{year === '2026' ? 'Current' : year === '2024' ? 'Active' : '\u00A0'}</div>
                  <div className="tl-dot"></div>
                  <div className="tl-label">{year}</div>
                </div>
              ))}
            </div>

            {/* EXECOM MEMBERS PANEL */}
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading Execom members...</div>
            ) : execomList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h4>No Records for {selectedYear}</h4>
                <p>No execom members have been registered under academic year {selectedYear}.</p>
              </div>
            ) : (
              <div className="team-panel active">
                {execomList.map((member) => (
                  <div className="tfc" key={member.id}>
                    <div className="tc-img">
                      <img src={member.image} alt={member.name} />
                    </div>
                    <h4>{member.name}</h4>
                    <p className="tc-role">{member.role}</p>
                    <p className="tfc-dept">{member.department}</p>
                    <a href={member.linkedin} className="tc-li" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
