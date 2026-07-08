import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/db';

const Gallery = () => {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Available categories (predefined + dynamic custom categories)
  const categories = React.useMemo(() => {
    const base = [
      { key: 'all', label: 'All' },
      { key: 'hackathon', label: 'Hackathons' },
      { key: 'bootcamp', label: 'Bootcamps' },
      { key: 'talk', label: 'Talks' },
      { key: 'workshop', label: 'Workshops' }
    ];
    
    const predefinedKeys = new Set(base.map(c => c.key));
    const customKeys = new Set();
    
    galleryItems.forEach(item => {
      if (item.category) {
        const normalized = item.category.trim().toLowerCase();
        if (normalized && !predefinedKeys.has(normalized)) {
          customKeys.add(item.category.trim());
        }
      }
    });
    
    const customCategories = Array.from(customKeys).map(cat => ({
      key: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }));
    
    return [...base, ...customCategories];
  }, [galleryItems]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const items = await database.getGallery();
        setGalleryItems(items);
      } catch (err) {
        console.error('Error fetching gallery items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Filter gallery items
  const filteredItems = galleryItems.filter(item => 
    activeFilter === 'all' || 
    (item.category && item.category.trim().toLowerCase() === activeFilter.trim().toLowerCase())
  );

  return (
    <div className="page active" id="page-gallery" style={{ paddingTop: '60px' }}>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> › Gallery
        </div>
        <h1>Snapshots of <span className="accent">Success</span></h1>
        <p>Moments of innovation, collaboration and celebration from IEDC AWH events.</p>
      </div>

      <section className="section">
        <div className="container">
          {/* FILTER BUTTONS */}
          <div className="gal-filter">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`gfb ${activeFilter === cat.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* GRID GALLERY */}
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Loading snapshots...</div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <h4>No Gallery Images Found</h4>
              <p>No snapshots match your category filter. Select another filter category to view photographs.</p>
            </div>
          ) : (
            <div className="gal-full" id="galGrid">
              {filteredItems.map((item) => (
                <div className="gfi" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div className="gfi-ov">
                    <span>{item.title}</span>
                    <small>{item.date || 'Event Photo'}</small>
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

export default Gallery;
