import React, { useState, useEffect } from 'react';
import { database, authService } from '../services/db';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries', 'events', 'achievements', 'team', 'gallery', 'alumni', 'stats', 'settings'
  
  // Data States
  const [inquiries, setInquiries] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [team, setTeam] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState({ totalMembers: '', eventsConducted: '', yearsOfInnovation: '' });
  const [generalSettings, setGeneralSettings] = useState({ nextEventTitle: '', nextEventDate: '', mission: '', vision: '', aboutText: '' });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Edit / Form States
  const [eventForm, setEventForm] = useState({ id: null, title: '', category: 'hackathon', date: '', location: '', description: '', image: '', isUpcoming: true, registrationUrl: '', eventReport: '' });
  const [achForm, setAchForm] = useState({ id: null, title: '', category: '1st Place', date: '', organizer: '', team: '', description: '', image: '' });
  const [teamForm, setTeamForm] = useState({ id: null, name: '', role: '', department: '', image: '', linkedin: '', year: '2026' });
  const [galleryForm, setGalleryForm] = useState({ id: null, title: '', category: 'hackathon', date: '', image: '' });
  const [alumniForm, setAlumniForm] = useState({ id: null, name: '', startup: '', description: '', image: '' });

  // Upload States
  const [uploadingState, setUploadingState] = useState({ event: false, team: false, gallery: false, ach: false, alumni: false });

  // Crop States
  const [cropModal, setCropModal] = useState({ isOpen: false, imgSrc: '', formType: '', fileName: '' });
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const containerRef = React.useRef(null);
  const imgRef = React.useRef(null);

  // Listen to Authentication State
  useEffect(() => {
    const unsubscribe = authService.onStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadDashboardData();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [fetchedInquiries, fetchedEvents, fetchedTeam, fetchedGallery, fetchedStats, fetchedAchs, fetchedAlumni, fetchedSettings] = await Promise.all([
        database.getSubmissions(),
        database.getEvents(),
        database.getTeam(),
        database.getGallery(),
        database.getStats(),
        database.getAchievements(),
        database.getAlumni(),
        database.getGeneralSettings()
      ]);
      setInquiries(fetchedInquiries);
      setEvents(fetchedEvents);
      setTeam(fetchedTeam);
      setGallery(fetchedGallery);
      setStats(fetchedStats);
      setAchievements(fetchedAchs);
      setAlumni(fetchedAlumni);
      setGeneralSettings(fetchedSettings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await authService.login(loginEmail, loginPassword);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  // --- IMAGE UPLOAD HELPER ---
  const handleImageFileChange = (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        isOpen: true,
        imgSrc: reader.result,
        formType: formType,
        fileName: file.name
      });
      setCropBox({ x: 10, y: 10, w: 80, h: 80 });
      // Reset input
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleCropDragStart = (e, action) => {
    e.preventDefault();
    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    if (startX === undefined || startY === undefined) return;

    const initialBox = { ...cropBox };
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerW = rect.width;
    const containerH = rect.height;

    const handleDragMove = (moveEvent) => {
      const currentX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const currentY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      if (currentX === undefined || currentY === undefined) return;

      const dx = ((currentX - startX) / containerW) * 100;
      const dy = ((currentY - startY) / containerH) * 100;

      setCropBox(prev => {
        let next = { ...initialBox };
        
        if (action === 'move') {
          next.x = Math.max(0, Math.min(100 - next.w, initialBox.x + dx));
          next.y = Math.max(0, Math.min(100 - next.h, initialBox.y + dy));
        } else if (action === 'br') {
          next.w = Math.max(5, Math.min(100 - next.x, initialBox.w + dx));
          next.h = Math.max(5, Math.min(100 - next.y, initialBox.h + dy));
        } else if (action === 'tl') {
          const newX = Math.max(0, Math.min(initialBox.x + initialBox.w - 5, initialBox.x + dx));
          next.w = initialBox.w + (initialBox.x - newX);
          next.x = newX;
          const newY = Math.max(0, Math.min(initialBox.y + initialBox.h - 5, initialBox.y + dy));
          next.h = initialBox.h + (initialBox.y - newY);
          next.y = newY;
        } else if (action === 'tr') {
          next.w = Math.max(5, Math.min(100 - next.x, initialBox.w + dx));
          const newY = Math.max(0, Math.min(initialBox.y + initialBox.h - 5, initialBox.y + dy));
          next.h = initialBox.h + (initialBox.y - newY);
          next.y = newY;
        } else if (action === 'bl') {
          const newX = Math.max(0, Math.min(initialBox.x + initialBox.w - 5, initialBox.x + dx));
          next.w = initialBox.w + (initialBox.x - newX);
          next.x = newX;
          next.h = Math.max(5, Math.min(100 - next.y, initialBox.h + dy));
        }
        return next;
      });
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  };

  const handleCropSave = async () => {
    if (!imgRef.current) return;
    const imgElement = imgRef.current;
    
    try {
      setUploadingState(prev => ({ ...prev, [cropModal.formType]: true }));
      setCropModal(prev => ({ ...prev, isOpen: false }));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const naturalW = imgElement.naturalWidth;
      const naturalH = imgElement.naturalHeight;
      
      const cropX = (cropBox.x / 100) * naturalW;
      const cropY = (cropBox.y / 100) * naturalH;
      const cropW = (cropBox.w / 100) * naturalW;
      const cropH = (cropBox.h / 100) * naturalH;
      
      canvas.width = cropW;
      canvas.height = cropH;
      
      ctx.drawImage(
        imgElement,
        cropX, cropY, cropW, cropH,
        0, 0, cropW, cropH
      );

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Canvas to blob conversion failed.');
        }
        
        const croppedFile = new File([blob], cropModal.fileName || 'cropped.jpg', { type: 'image/jpeg' });
        const url = await database.uploadImage(croppedFile);
        const formType = cropModal.formType;

        if (formType === 'event') {
          setEventForm(prev => ({ ...prev, image: url }));
        } else if (formType === 'team') {
          setTeamForm(prev => ({ ...prev, image: url }));
        } else if (formType === 'gallery') {
          setGalleryForm(prev => ({ ...prev, image: url }));
        } else if (formType === 'ach') {
          setAchForm(prev => ({ ...prev, image: url }));
        } else if (formType === 'alumni') {
          setAlumniForm(prev => ({ ...prev, image: url }));
        }
        alert('Image cropped and uploaded successfully!');
      }, 'image/jpeg', 0.9);
      
    } catch (err) {
      console.error('Crop/Upload error:', err);
      alert('Crop/Upload failed: ' + err.message);
    } finally {
      setUploadingState(prev => ({ ...prev, [cropModal.formType]: false }));
    }
  };

  // --- CRUD ACTIONS: INQUIRIES ---
  const handleToggleRead = async (id, isRead) => {
    await database.markSubmissionRead(id, isRead);
    setInquiries(prev => prev.map(x => x.id === id ? { ...x, isRead } : x));
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      await database.deleteSubmission(id);
      setInquiries(prev => prev.filter(x => x.id !== id));
    }
  };

  // --- CRUD ACTIONS: EVENTS ---
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const cleanEvent = {
      ...eventForm,
      isUpcoming: eventForm.isUpcoming === true || eventForm.isUpcoming === 'true'
    };
    const saved = await database.saveEvent(cleanEvent);
    
    if (eventForm.id) {
      setEvents(prev => prev.map(x => x.id === eventForm.id ? saved : x));
    } else {
      setEvents(prev => [...prev, saved]);
    }
    
    setEventForm({ id: null, title: '', category: 'hackathon', date: '', location: '', description: '', image: '', isUpcoming: true, registrationUrl: '', eventReport: '' });
  };

  const handleEditEvent = (ev) => {
    setEventForm(ev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete this event?')) {
      await database.deleteEvent(id);
      setEvents(prev => prev.filter(x => x.id !== id));
    }
  };

  // --- CRUD ACTIONS: ACHIEVEMENTS ---
  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    const saved = await database.saveAchievement(achForm);
    if (achForm.id) {
      setAchievements(prev => prev.map(x => x.id === achForm.id ? saved : x));
    } else {
      setAchievements(prev => [...prev, saved]);
    }
    setAchForm({ id: null, title: '', category: '1st Place', date: '', organizer: '', team: '', description: '', image: '' });
  };

  const handleEditAchievement = (ach) => {
    setAchForm(ach);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAchievement = async (id) => {
    if (window.confirm('Delete this achievement?')) {
      await database.deleteAchievement(id);
      setAchievements(prev => prev.filter(x => x.id !== id));
    }
  };

  // --- CRUD ACTIONS: TEAM ---
  const handleSaveTeamMember = async (e) => {
    e.preventDefault();
    const saved = await database.saveTeamMember(teamForm);
    if (teamForm.id) {
      setTeam(prev => prev.map(x => x.id === teamForm.id ? saved : x));
    } else {
      setTeam(prev => [...prev, saved]);
    }
    setTeamForm({ id: null, name: '', role: '', department: '', image: '', linkedin: '', year: '2026' });
  };

  const handleEditTeamMember = (member) => {
    setTeamForm(member);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTeamMember = async (id) => {
    if (window.confirm('Delete this team member?')) {
      await database.deleteTeamMember(id);
      setTeam(prev => prev.filter(x => x.id !== id));
    }
  };

  // --- CRUD ACTIONS: GALLERY ---
  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    const saved = await database.saveGalleryItem(galleryForm);
    if (galleryForm.id) {
      setGallery(prev => prev.map(x => x.id === galleryForm.id ? saved : x));
    } else {
      setGallery(prev => [...prev, saved]);
    }
    setGalleryForm({ id: null, title: '', category: 'hackathon', date: '', image: '' });
  };

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm('Delete this gallery photo?')) {
      await database.deleteGalleryItem(id);
      setGallery(prev => prev.filter(x => x.id !== id));
    }
  };

  // --- CRUD ACTIONS: ALUMNI ---
  const handleSaveAlumni = async (e) => {
    e.preventDefault();
    const saved = await database.saveAlumni(alumniForm);
    if (alumniForm.id) {
      setAlumni(prev => prev.map(x => x.id === alumniForm.id ? saved : x));
    } else {
      setAlumni(prev => [...prev, saved]);
    }
    setAlumniForm({ id: null, name: '', startup: '', description: '', image: '' });
  };

  const handleEditAlumni = (al) => {
    setAlumniForm(al);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAlumni = async (id) => {
    if (window.confirm('Delete this alumni record?')) {
      await database.deleteAlumni(id);
      setAlumni(prev => prev.filter(x => x.id !== id));
    }
  };

  // --- ACTIONS: STATS ---
  const handleSaveStats = async (e) => {
    e.preventDefault();
    await database.saveStats(stats);
    alert('Landing page statistics updated!');
  };

  // --- ACTIONS: GENERAL SETTINGS ---
  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    await database.saveGeneralSettings(generalSettings);
    alert('Vision, Mission, and Event banner updated!');
  };

  // ==========================================================================
  // RENDER LOGIN SCREEN (if not logged in)
  // ==========================================================================
  if (!user) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <h2>Admin Console</h2>
          <p>Please sign in to manage web content</p>
          
          {loginError && (
            <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="fg" style={{ textAlign: 'left' }}>
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="admin@iedcawh.org"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="fg" style={{ textAlign: 'left' }}>
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-blue" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
              Sign In
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <strong>Demo Credentials:</strong><br/>
            Email: <code style={{ color: 'var(--white)' }}>admin@iedcawh.org</code><br/>
            Password: <code style={{ color: 'var(--white)' }}>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER DASHBOARD PANEL
  // ==========================================================================
  return (
    <div className="admin-container">
      {/* MOBILE MENU TOGGLE & HEADER */}
      <div className="admin-mobile-header">
        <button 
          className="admin-menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? '✕' : '|||'}
        </button>
        <span className="admin-mobile-title">
          {activeTab === 'inquiries' && '📬 Inbox Log'}
          {activeTab === 'events' && '📅 Events Manager'}
          {activeTab === 'achievements' && '🏆 Achievements Log'}
          {activeTab === 'team' && '👥 Execom & Faculty'}
          {activeTab === 'gallery' && '🖼️ Gallery Assets'}
          {activeTab === 'alumni' && '🎓 Alumni Startups'}
          {activeTab === 'stats' && '📊 Update Metrics'}
          {activeTab === 'settings' && '⚙️ Page Settings'}
        </span>
        <div style={{ width: '32px' }}></div> {/* spacer for centering title */}
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h3>Dashboard</h3>
        <div className="admin-nav-item-wrap">
          <div 
            className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inquiries'); setIsSidebarOpen(false); }}
          >
            📬 Inbox 
            {inquiries.filter(x => !x.isRead).length > 0 && (
              <span className="badge-unread">{inquiries.filter(x => !x.isRead).length}</span>
            )}
          </div>
          
          <div 
            className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }}
          >
            📅 Events
          </div>

          <div 
            className={`admin-nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => { setActiveTab('achievements'); setIsSidebarOpen(false); }}
          >
            🏆 Achievements
          </div>
          
          <div 
            className={`admin-nav-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => { setActiveTab('team'); setIsSidebarOpen(false); }}
          >
            👥 Execom List
          </div>
          
          <div 
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }}
          >
            🖼️ Gallery Assets
          </div>

          <div 
            className={`admin-nav-item ${activeTab === 'alumni' ? 'active' : ''}`}
            onClick={() => { setActiveTab('alumni'); setIsSidebarOpen(false); }}
          >
            🎓 Alumni Startups
          </div>
          
          <div 
            className={`admin-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }}
          >
            📊 Metrics Count
          </div>

          <div 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
          >
            ⚙️ Page Settings
          </div>

          <button 
            className="btn btn-danger" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '2rem', fontSize: '0.85rem', padding: '0.6rem 1rem' }}
            onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT PANEL */}
      <main className="admin-content">
        {loading && (
          <div style={{ position: 'fixed', top: '75px', right: '30px', background: 'var(--blue)', color: 'var(--bg)', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.78rem', zIndex: 1000, fontWeight: 'bold' }}>
            Syncing data...
          </div>
        )}

        {/* --- TABS: CONTACT INBOX --- */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="admin-header">
              <h1>Inquiries Log</h1>
              <p>Total: {inquiries.length} messages</p>
            </div>
            
            {inquiries.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No messages received yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {inquiries.map(item => (
                  <div 
                    className="admin-card" 
                    key={item.id} 
                    style={{ 
                      borderLeft: item.isRead ? '1px solid var(--border)' : '4px solid var(--blue)',
                      opacity: item.isRead ? 0.8 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h3>{item.name} <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>({item.email})</span></h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 600 }}>{item.college || 'No organization listed'}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                          {item.timestamp?.seconds 
                            ? new Date(item.timestamp.seconds * 1000).toLocaleString() 
                            : new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--bg3)', padding: '1rem', borderRadius: 'var(--r)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <p style={{ fontWeight: 'bold', color: 'var(--white)', marginBottom: '0.25rem' }}>Subject: {item.subject}</p>
                      <p style={{ color: 'var(--white)', opacity: 0.85 }}>{item.message}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        className="btn btn-ghost"
                        style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                        onClick={() => handleToggleRead(item.id, !item.isRead)}
                      >
                        {item.isRead ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                        onClick={() => handleDeleteInquiry(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TABS: EVENTS MANAGER --- */}
        {activeTab === 'events' && (
          <div>
            <div className="admin-header">
              <h1>Events Manager</h1>
              <button 
                className="btn btn-blue"
                onClick={() => setEventForm({ id: null, title: '', category: 'hackathon', date: '', location: '', description: '', image: '', isUpcoming: true, registrationUrl: '', eventReport: '' })}
              >
                + Create Event
              </button>
            </div>

            <div className="admin-card">
              <h3>{eventForm.id ? 'Edit Event' : 'Create New Event'}</h3>
              <form onSubmit={handleSaveEvent} style={{ marginTop: '1.5rem' }}>
                <div className="fg-row">
                  <div className="fg">
                    <label>Event Title *</label>
                    <input 
                      type="text" 
                      value={eventForm.title} 
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="fg">
                    <label>Category</label>
                    <select 
                      value={eventForm.category} 
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    >
                      <option value="hackathon">Hackathon</option>
                      <option value="bootcamp">Bootcamp</option>
                      <option value="talk">Talk (i-Talk)</option>
                      <option value="workshop">Workshop</option>
                      <option value="idea">Idea Fest</option>
                    </select>
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Event Date</label>
                    <input 
                      type="date" 
                      value={eventForm.date} 
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    />
                  </div>
                  <div className="fg">
                    <label>Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. AWH Campus"
                      value={eventForm.location} 
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Event Cover Image</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageFileChange(e, 'event')}
                          style={{ fontSize: '0.8rem' }}
                        />
                        {uploadingState.event && <span style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 'bold' }}>Uploading...</span>}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Or paste image URL directly..."
                        value={eventForm.image} 
                        onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="fg">
                    <label>Status</label>
                    <select 
                      value={eventForm.isUpcoming.toString()} 
                      onChange={(e) => setEventForm({ ...eventForm, isUpcoming: e.target.value === 'true' })}
                    >
                      <option value="true">Upcoming (Accepts registrations)</option>
                      <option value="false">Past / Completed</option>
                    </select>
                  </div>
                </div>

                <div className="fg">
                  <label>Registration Link (For Upcoming Events)</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    value={eventForm.registrationUrl} 
                    onChange={(e) => setEventForm({ ...eventForm, registrationUrl: e.target.value })}
                  />
                </div>

                <div className="fg">
                  <label>Short Description</label>
                  <textarea 
                    value={eventForm.description} 
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  ></textarea>
                </div>

                {!eventForm.isUpcoming && (
                  <div className="fg">
                    <label>Event Report (Recap / Summary for Past Events)</label>
                    <textarea 
                      placeholder="Write a summary of what happened..."
                      value={eventForm.eventReport} 
                      onChange={(e) => setEventForm({ ...eventForm, eventReport: e.target.value })}
                    ></textarea>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-blue">
                    {eventForm.id ? 'Update Event' : 'Save Event'}
                  </button>
                  {eventForm.id && (
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={() => setEventForm({ id: null, title: '', category: 'hackathon', date: '', location: '', description: '', image: '', isUpcoming: true, registrationUrl: '', eventReport: '' })}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Events Grid */}
            <div className="admin-grid-cards">
              {events.map(ev => (
                <div className="admin-crud-card" key={ev.id}>
                  <div>
                    <img 
                      src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100'} 
                      alt="" 
                      style={{ width: '100%', height: '120px', borderRadius: '4px', marginBottom: '1rem', objectFit: 'cover' }}
                    />
                    <h4 style={{ marginBottom: '0.25rem' }}>{ev.title}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--blue)', textTransform: 'uppercase', fontWeight: 'bold' }}>{ev.category}</span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{ev.date} · {ev.location}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      {ev.isUpcoming ? '🟢 Upcoming' : '⚫ Completed'}
                    </p>
                  </div>
                  <div className="admin-crud-actions">
                    <button className="btn btn-ghost" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleEditEvent(ev)}>Edit</button>
                    <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleDeleteEvent(ev.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TABS: ACHIEVEMENTS --- */}
        {activeTab === 'achievements' && (
          <div>
            <div className="admin-header">
              <h1>Achievements Log</h1>
              <button 
                className="btn btn-blue"
                onClick={() => setAchForm({ id: null, title: '', category: '1st Place', date: '', organizer: '', team: '', description: '', image: '' })}
              >
                + Add Achievement
              </button>
            </div>

            <div className="admin-card">
              <h3>{achForm.id ? 'Edit Achievement Details' : 'Add New Achievement'}</h3>
              <form onSubmit={handleSaveAchievement} style={{ marginTop: '1.5rem' }}>
                <div className="fg-row">
                  <div className="fg">
                    <label>Achievement Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. State Hardware Hackathon"
                      value={achForm.title} 
                      onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="fg">
                    <label>Award / Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1st Place, Runner Up"
                      value={achForm.category} 
                      onChange={(e) => setAchForm({ ...achForm, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Date</label>
                    <input 
                      type="date" 
                      value={achForm.date} 
                      onChange={(e) => setAchForm({ ...achForm, date: e.target.value })}
                    />
                  </div>
                  <div className="fg">
                    <label>Organizer</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Kerala Startup Mission"
                      value={achForm.organizer} 
                      onChange={(e) => setAchForm({ ...achForm, organizer: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Achievement Image</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageFileChange(e, 'ach')}
                          style={{ fontSize: '0.8rem' }}
                        />
                        {uploadingState.ach && <span style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 'bold' }}>Uploading...</span>}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Or paste image URL directly..."
                        value={achForm.image} 
                        onChange={(e) => setAchForm({ ...achForm, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="fg">
                    <label>Winning Team details</label>
                    <input 
                      type="text" 
                      placeholder="Team: Arun K, Sneha R, Rahul M"
                      value={achForm.team} 
                      onChange={(e) => setAchForm({ ...achForm, team: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fg">
                  <label>Short Description</label>
                  <textarea 
                    value={achForm.description} 
                    onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-blue">
                    {achForm.id ? 'Update Details' : 'Save Achievement'}
                  </button>
                  {achForm.id && (
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={() => setAchForm({ id: null, title: '', category: '1st Place', date: '', organizer: '', team: '', description: '', image: '' })}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Achievements Grid */}
            <div className="admin-grid-cards">
              {achievements.map(ach => (
                <div className="admin-crud-card" key={ach.id}>
                  <div>
                    <img 
                      src={ach.image || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100'} 
                      alt="" 
                      style={{ width: '100%', height: '120px', borderRadius: '4px', marginBottom: '1rem', objectFit: 'cover' }}
                    />
                    <h4 style={{ marginBottom: '0.25rem' }}>{ach.title}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--blue)', textTransform: 'uppercase', fontWeight: 'bold' }}>{ach.category}</span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{ach.organizer} · {ach.date}</p>
                  </div>
                  <div className="admin-crud-actions">
                    <button className="btn btn-ghost" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleEditAchievement(ach)}>Edit</button>
                    <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleDeleteAchievement(ach.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TABS: TEAM MANAGER --- */}
        {activeTab === 'team' && (
          <div>
            <div className="admin-header">
              <h1>Execom & Faculty Directory</h1>
              <button 
                className="btn btn-blue"
                onClick={() => setTeamForm({ id: null, name: '', role: '', department: '', image: '', linkedin: '', year: '2026' })}
              >
                + Add Member
              </button>
            </div>

            <div className="admin-card">
              <h3>{teamForm.id ? 'Edit Member Details' : 'Add New Execom / Faculty Member'}</h3>
              <form onSubmit={handleSaveTeamMember} style={{ marginTop: '1.5rem' }}>
                <div className="fg-row">
                  <div className="fg">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      value={teamForm.name} 
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="fg">
                    <label>Designated Role</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Student Lead / Nodal Officer"
                      value={teamForm.role} 
                      onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Department / Branch</label>
                    <input 
                      type="text" 
                      placeholder="e.g. S5 CSE / Faculty ECE"
                      value={teamForm.department} 
                      onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                    />
                  </div>
                  <div className="fg">
                    <label>Associated Execom Year</label>
                    <select 
                      value={teamForm.year} 
                      onChange={(e) => setTeamForm({ ...teamForm, year: e.target.value })}
                    >
                      <option value="Faculty">Faculty Coordinator</option>
                      <option value="2026">2026 Execom</option>
                      <option value="2025">2025 Execom</option>
                      <option value="2024">2024 Execom (Founding)</option>
                    </select>
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Member Profile Photo</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageFileChange(e, 'team')}
                          style={{ fontSize: '0.8rem' }}
                        />
                        {uploadingState.team && <span style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 'bold' }}>Uploading...</span>}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Or paste profile image URL..."
                        value={teamForm.image} 
                        onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="fg">
                    <label>LinkedIn Link</label>
                    <input 
                      type="text" 
                      placeholder="https://linkedin.com/in/..."
                      value={teamForm.linkedin} 
                      onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-blue">
                    {teamForm.id ? 'Update Member' : 'Save Member'}
                  </button>
                  {teamForm.id && (
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={() => setTeamForm({ id: null, name: '', role: '', department: '', image: '', linkedin: '', year: '2026' })}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Team Members List */}
            <div className="admin-grid-cards">
              {team.map(member => (
                <div className="admin-crud-card" key={member.id}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img 
                      src={member.image || 'https://randomuser.me/api/portraits/men/10.jpg'} 
                      alt="" 
                      style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--blue)', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.92rem' }}>{member.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--blue)' }}>{member.role}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Year: {member.year} · {member.department}</p>
                    </div>
                  </div>
                  <div className="admin-crud-actions" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button className="btn btn-ghost" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleEditTeamMember(member)}>Edit</button>
                    <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleDeleteTeamMember(member.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TABS: GALLERY MANAGER --- */}
        {activeTab === 'gallery' && (
          <div>
            <div className="admin-header">
              <h1>Gallery Assets</h1>
            </div>

            <div className="admin-card">
              <h3>Upload Photo Record</h3>
              <form onSubmit={handleSaveGalleryItem} style={{ marginTop: '1.5rem' }}>
                <div className="fg-row">
                  <div className="fg">
                    <label>Photo Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HackSurface 2.0"
                      value={galleryForm.title} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="fg">
                    <label>Category</label>
                    <select 
                      value={galleryForm.category} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    >
                      <option value="hackathon">Hackathon</option>
                      <option value="bootcamp">Bootcamp</option>
                      <option value="talk">Talk (i-Talk)</option>
                      <option value="workshop">Workshop</option>
                    </select>
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Event Date</label>
                    <input 
                      type="date" 
                      value={galleryForm.date} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                    />
                  </div>
                  <div className="fg">
                    <label>Gallery Image Asset</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageFileChange(e, 'gallery')}
                          style={{ fontSize: '0.8rem' }}
                        />
                        {uploadingState.gallery && <span style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 'bold' }}>Uploading...</span>}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Or paste asset image URL..."
                        value={galleryForm.image} 
                        onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-blue">
                  Add Photo
                </button>
              </form>
            </div>

            {/* Gallery list */}
            <div className="admin-grid-cards">
              {gallery.map(item => (
                <div className="admin-crud-card" key={item.id}>
                  <div>
                    <img 
                      src={item.image} 
                      alt="" 
                      style={{ width: '100%', height: '140px', borderRadius: '4px', marginBottom: '1rem', objectFit: 'cover' }}
                    />
                    <h4>{item.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item.category} · {item.date}</p>
                  </div>
                  <div className="admin-crud-actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleDeleteGalleryItem(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TABS: ALUMNI MANAGER --- */}
        {activeTab === 'alumni' && (
          <div>
            <div className="admin-header">
              <h1>Alumni Startups Directory</h1>
              <button 
                className="btn btn-blue"
                onClick={() => setAlumniForm({ id: null, name: '', startup: '', description: '', image: '' })}
              >
                + Add Alumni Profile
              </button>
            </div>

            <div className="admin-card">
              <h3>{alumniForm.id ? 'Edit Alumni Details' : 'Add Alumni Profile'}</h3>
              <form onSubmit={handleSaveAlumni} style={{ marginTop: '1.5rem' }}>
                <div className="fg-row">
                  <div className="fg">
                    <label>Founder Full Name *</label>
                    <input 
                      type="text" 
                      value={alumniForm.name} 
                      onChange={(e) => setAlumniForm({ ...alumniForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="fg">
                    <label>Startup Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. GreenSort Technologies"
                      value={alumniForm.startup} 
                      onChange={(e) => setAlumniForm({ ...alumniForm, startup: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fg-row">
                  <div className="fg">
                    <label>Founder Profile Photo</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageFileChange(e, 'alumni')}
                          style={{ fontSize: '0.8rem' }}
                        />
                        {uploadingState.alumni && <span style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 'bold' }}>Uploading...</span>}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Or paste profile image URL..."
                        value={alumniForm.image} 
                        onChange={(e) => setAlumniForm({ ...alumniForm, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="fg">
                    <label>Startup details / Pitch (1-2 sentences)</label>
                    <input 
                      type="text" 
                      placeholder="Built waste sorting startup deployed in 3 municipalities. Batch of 2021, CSE."
                      value={alumniForm.description} 
                      onChange={(e) => setAlumniForm({ ...alumniForm, description: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-blue">
                    {alumniForm.id ? 'Update Profile' : 'Save Profile'}
                  </button>
                  {alumniForm.id && (
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={() => setAlumniForm({ id: null, name: '', startup: '', description: '', image: '' })}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Alumni list */}
            <div className="admin-grid-cards">
              {alumni.map(al => (
                <div className="admin-crud-card" key={al.id}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img 
                      src={al.image || 'https://randomuser.me/api/portraits/men/10.jpg'} 
                      alt="" 
                      style={{ width: '55px', height: '55px', borderRadius: '50%', border: '1px solid var(--blue)', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.92rem' }}>{al.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 'bold' }}>{al.startup}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{al.description}</p>
                    </div>
                  </div>
                  <div className="admin-crud-actions" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button className="btn btn-ghost" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleEditAlumni(al)}>Edit</button>
                    <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }} onClick={() => handleDeleteAlumni(al.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TABS: METRICS MANAGER --- */}
        {activeTab === 'stats' && (
          <div>
            <div className="admin-header">
              <h1>Update Metrics</h1>
              <p>Modify counts displayed on the home page stats grid</p>
            </div>

            <div className="admin-card" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSaveStats}>
                <div className="fg">
                  <label>Total Members Stats Count</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 500+"
                    value={stats.totalMembers} 
                    onChange={(e) => setStats({ ...stats, totalMembers: e.target.value })}
                    required
                  />
                </div>
                
                <div className="fg">
                  <label>Events Conducted Count</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 40+"
                    value={stats.eventsConducted} 
                    onChange={(e) => setStats({ ...stats, eventsConducted: e.target.value })}
                    required
                  />
                </div>
                
                <div className="fg">
                  <label>Years of Innovation Count</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8+"
                    value={stats.yearsOfInnovation} 
                    onChange={(e) => setStats({ ...stats, yearsOfInnovation: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-blue" style={{ marginTop: '1rem' }}>
                  Update Landing Stats
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- TABS: GENERAL SETTINGS --- */}
        {activeTab === 'settings' && (
          <div>
            <div className="admin-header">
              <h1>General Page Settings</h1>
              <p>Modify vision, mission, and alert banner content globally</p>
            </div>

            <div className="admin-card" style={{ maxWidth: '700px' }}>
              <form onSubmit={handleSaveGeneralSettings}>
                <div className="fg-row">
                  <div className="fg">
                    <label>Floating Banner - Next Event Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HackSurface 3.0"
                      value={generalSettings.nextEventTitle} 
                      onChange={(e) => setGeneralSettings({ ...generalSettings, nextEventTitle: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="fg">
                    <label>Floating Banner - Next Event Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jan 2026"
                      value={generalSettings.nextEventDate} 
                      onChange={(e) => setGeneralSettings({ ...generalSettings, nextEventDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="fg">
                  <label>Mission Statement</label>
                  <textarea 
                    value={generalSettings.mission} 
                    onChange={(e) => setGeneralSettings({ ...generalSettings, mission: e.target.value })}
                    required
                    style={{ minHeight: '80px' }}
                  ></textarea>
                </div>

                <div className="fg">
                  <label>Vision Statement</label>
                  <textarea 
                    value={generalSettings.vision} 
                    onChange={(e) => setGeneralSettings({ ...generalSettings, vision: e.target.value })}
                    required
                    style={{ minHeight: '80px' }}
                  ></textarea>
                </div>

                <div className="fg">
                  <label>About Page - Who We Are Description</label>
                  <textarea 
                    value={generalSettings.aboutText} 
                    onChange={(e) => setGeneralSettings({ ...generalSettings, aboutText: e.target.value })}
                    required
                    style={{ minHeight: '100px' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-blue" style={{ marginTop: '1rem' }}>
                  Update Settings & About Page
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* DRAGGABLE CROP MODAL */}
      {cropModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem',
          boxSizing: 'border-box'
        }}>
          <div className="admin-card" style={{
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            <h3 style={{ margin: 0, color: 'var(--white)' }}>Adjust & Crop Image</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Drag the box to position, or drag the corners to resize the crop area (free dimensions).
            </p>

            {/* Crop Container Wrapper */}
            <div style={{
              width: '100%',
              maxHeight: '50vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Inner Wrapper that wraps the image exactly */}
              <div 
                ref={containerRef}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  userSelect: 'none'
                }}
              >
                <img 
                  ref={imgRef}
                  src={cropModal.imgSrc} 
                  alt="Source" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '50vh',
                    display: 'block',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Crop Box Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.w}%`,
                    height: `${cropBox.h}%`,
                    border: '2px dashed #3b82f6',
                    cursor: 'move',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
                  }}
                  onMouseDown={(e) => handleCropDragStart(e, 'move')}
                  onTouchStart={(e) => handleCropDragStart(e, 'move')}
                >
                  {/* Corner Handles */}
                  {/* Top-Left */}
                  <div 
                    style={{
                      position: 'absolute',
                      left: '-6px',
                      top: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#3b82f6',
                      border: '1px solid #fff',
                      cursor: 'nwse-resize'
                    }}
                    onMouseDown={(e) => { e.stopPropagation(); handleCropDragStart(e, 'tl'); }}
                    onTouchStart={(e) => { e.stopPropagation(); handleCropDragStart(e, 'tl'); }}
                  />
                  {/* Top-Right */}
                  <div 
                    style={{
                      position: 'absolute',
                      right: '-6px',
                      top: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#3b82f6',
                      border: '1px solid #fff',
                      cursor: 'nesw-resize'
                    }}
                    onMouseDown={(e) => { e.stopPropagation(); handleCropDragStart(e, 'tr'); }}
                    onTouchStart={(e) => { e.stopPropagation(); handleCropDragStart(e, 'tr'); }}
                  />
                  {/* Bottom-Left */}
                  <div 
                    style={{
                      position: 'absolute',
                      left: '-6px',
                      bottom: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#3b82f6',
                      border: '1px solid #fff',
                      cursor: 'nesw-resize'
                    }}
                    onMouseDown={(e) => { e.stopPropagation(); handleCropDragStart(e, 'bl'); }}
                    onTouchStart={(e) => { e.stopPropagation(); handleCropDragStart(e, 'bl'); }}
                  />
                  {/* Bottom-Right */}
                  <div 
                    style={{
                      position: 'absolute',
                      right: '-6px',
                      bottom: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#3b82f6',
                      border: '1px solid #fff',
                      cursor: 'nwse-resize'
                    }}
                    onMouseDown={(e) => { e.stopPropagation(); handleCropDragStart(e, 'br'); }}
                    onTouchStart={(e) => { e.stopPropagation(); handleCropDragStart(e, 'br'); }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => setCropModal({ isOpen: false, imgSrc: '', formType: '', fileName: '' })}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-blue"
                onClick={handleCropSave}
              >
                Crop & Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
