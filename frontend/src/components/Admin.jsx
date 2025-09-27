import React, { useState, useEffect } from 'react';
import { buildApiUrl, buildUploadUrl } from '../utils/api';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [galleryItems, setGalleryItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    file: null,
    is_featured: false,
    tags: ''
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_file: null,
    ticket_url: '',
    is_featured: false,
    tags: ''
  });
  const [messages, setMessages] = useState({ gallery: '', events: '' });
  const [loading, setLoading] = useState({ gallery: false, events: false });

  useEffect(() => {
    // Check if already authenticated from localStorage
    const savedAuth = localStorage.getItem('wmvl_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadGalleryItems();
      loadEvents();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with password:', loginForm.password);
    
    // Simple password check - in production, this should be handled by the backend
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
    console.log('Environment password loaded:', ADMIN_PASSWORD ? 'Yes' : 'No');

    if (loginForm.password === ADMIN_PASSWORD) {
      console.log('Password correct, logging in...');
      setIsAuthenticated(true);
      localStorage.setItem('wmvl_admin_auth', 'true');
      setLoginError('');
    } else {
      console.log('Password incorrect');
      setLoginError('Invalid password. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('wmvl_admin_auth');
    setLoginForm({ password: '' });
  };

  const loadGalleryItems = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/gallery'));
      const result = await response.json();
      setGalleryItems(result.gallery || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/events'));
      const result = await response.json();
      setEvents(result.events || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, gallery: true });
    
    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('description', galleryForm.description);
    formData.append('file', galleryForm.file);
    formData.append('is_featured', galleryForm.is_featured);
    formData.append('tags', galleryForm.tags);

    try {
      const response = await fetch(buildApiUrl('/admin/upload'), {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setMessages({ ...messages, gallery: '✅ Image uploaded successfully!' });
        setGalleryForm({ title: '', description: '', file: null, is_featured: false, tags: '' });
        loadGalleryItems();
        // Clear message after 3 seconds
        setTimeout(() => setMessages({ ...messages, gallery: '' }), 3000);
      } else {
        setMessages({ ...messages, gallery: `❌ Error: ${result.error}` });
      }
    } catch (error) {
      setMessages({ ...messages, gallery: `❌ Network error: ${error.message}` });
    }
    
    setLoading({ ...loading, gallery: false });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, events: true });

    const formData = new FormData();
    formData.append('title', eventForm.title);
    formData.append('description', eventForm.description);
    formData.append('event_date', eventForm.event_date);
    formData.append('location', eventForm.location);
    if (eventForm.image_file) {
      formData.append('image_file', eventForm.image_file);
    }
    formData.append('ticket_url', eventForm.ticket_url);
    formData.append('is_featured', eventForm.is_featured);
    formData.append('tags', eventForm.tags);

    try {
      const response = await fetch(buildApiUrl('/api/events'), {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setMessages({ ...messages, events: '✅ Event created successfully!' });
        setEventForm({
          title: '', description: '', event_date: '', location: '',
          image_file: null, ticket_url: '', is_featured: false, tags: ''
        });
        loadEvents();
        // Clear message after 3 seconds
        setTimeout(() => setMessages({ ...messages, events: '' }), 3000);
      } else {
        setMessages({ ...messages, events: `❌ Error: ${result.error}` });
      }
    } catch (error) {
      setMessages({ ...messages, events: `❌ Network error: ${error.message}` });
    }
    
    setLoading({ ...loading, events: false });
  };

  const deleteGalleryItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const response = await fetch(buildApiUrl(`/api/gallery/${id}`), {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          loadGalleryItems();
        } else {
          alert('Error deleting item: ' + result.error);
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(buildApiUrl(`/api/events/${id}`), {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          loadEvents();
        } else {
          alert('Error deleting event: ' + result.error);
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: "'Courier New', monospace",
      backgroundColor: '#000000',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '100px 20px 20px',
    },
    
    adminContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    
    adminHeader: {
      textAlign: 'center',
      marginBottom: '40px',
      borderBottom: '2px solid #ff0000',
      paddingBottom: '20px'
    },
    
    adminTitle: {
      color: '#ff0000',
      fontSize: '3em',
      textShadow: '0 0 10px #ff0000',
      marginBottom: '10px',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '0.1em'
    },
    
    adminSubtitle: {
      color: '#cccccc',
      fontSize: '1.2em',
      fontFamily: "'Courier New', monospace"
    },
    
    adminSections: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
      marginBottom: '40px'
    },
    
    adminSection: {
      background: 'rgba(255, 0, 0, 0.1)',
      border: '2px solid #ff0000',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
    },
    
    adminSectionTitle: {
      color: '#ff0000',
      marginBottom: '25px',
      fontSize: '1.8em',
      textShadow: '0 0 5px #ff0000',
      fontFamily: "'Courier New', monospace"
    },
    
    formGroup: {
      marginBottom: '20px'
    },
    
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#ffffff',
      fontWeight: 'bold',
      fontFamily: "'Courier New', monospace"
    },
    
    formInput: {
      width: '100%',
      padding: '12px',
      background: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid #333',
      borderRadius: '5px',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease'
    },
    
    formTextarea: {
      width: '100%',
      padding: '12px',
      background: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid #333',
      borderRadius: '5px',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: "'Courier New', monospace",
      resize: 'vertical',
      minHeight: '100px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease'
    },
    
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px'
    },
    
    adminButton: {
      background: 'linear-gradient(45deg, #ff0000, #cc0000)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '0.05em',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)'
    },
    
    message: {
      padding: '15px',
      borderRadius: '5px',
      marginTop: '20px',
      fontWeight: 'bold',
      fontFamily: "'Courier New', monospace",
      border: '1px solid'
    },
    
    itemsList: {
      maxHeight: '500px',
      overflowY: 'auto',
      border: '2px solid #333',
      borderRadius: '8px',
      background: 'rgba(0, 0, 0, 0.5)',
      marginTop: '20px'
    },
    
    adminItem: {
      padding: '20px',
      borderBottom: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background-color 0.3s ease'
    },
    
    adminItemInfo: {
      display: 'flex',
      alignItems: 'center',
      flex: 1
    },
    
    adminItemTitle: {
      color: '#ff0000',
      marginBottom: '8px',
      fontFamily: "'Courier New', monospace",
      fontSize: '1.1em'
    },
    
    adminItemDesc: {
      color: '#ccc',
      fontSize: '0.95em',
      marginBottom: '5px',
      fontFamily: "'Courier New', monospace"
    },
    
    adminItemDate: {
      color: '#888',
      fontSize: '0.85em',
      fontFamily: "'Courier New', monospace"
    },
    
    deleteButton: {
      background: 'linear-gradient(45deg, #666, #444)',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '5px',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s ease',
      ':hover': {
        background: 'linear-gradient(45deg, #ff0000, #cc0000)'
      }
    },
    
    previewImage: {
      maxWidth: '120px',
      maxHeight: '120px',
      borderRadius: '8px',
      marginRight: '20px',
      objectFit: 'cover',
      border: '2px solid #333'
    },
    
    emptyState: {
      padding: '40px',
      textAlign: 'center',
      color: '#666',
      fontFamily: "'Courier New', monospace",
      fontSize: '1.1em'
    },
    
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '40px'
    },
    
    statCard: {
      background: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid #ff0000',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center'
    },
    
    statNumber: {
      fontSize: '2em',
      fontWeight: 'bold',
      color: '#ff0000',
      display: 'block'
    },
    
    statLabel: {
      color: '#cccccc',
      fontSize: '0.9em',
      marginTop: '5px'
    },
    
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh'
    },
    
    loginBox: {
      background: 'rgba(255, 0, 0, 0.1)',
      border: '2px solid #ff0000',
      borderRadius: '15px',
      padding: '40px',
      boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    },
    
    loginTitle: {
      color: '#ff0000',
      fontSize: '2.5em',
      textShadow: '0 0 10px #ff0000',
      marginBottom: '30px',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '0.1em'
    },
    
    loginError: {
      color: '#ff0000',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid #ff0000',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '20px',
      fontFamily: "'Courier New', monospace"
    },
    
    logoutButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(45deg, #666, #444)',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s ease'
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginContainer}>
          <div style={styles.loginBox}>
            <h1 style={styles.loginTitle}>🔒 ADMIN ACCESS</h1>
            <p style={{ color: '#cccccc', marginBottom: '30px', fontFamily: "'Courier New', monospace" }}>
              Enter password to access the admin panel
            </p>
            
            {loginError && (
              <div style={styles.loginError}>
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div style={styles.formGroup}>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ password: e.target.value })}
                  style={styles.formInput}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              
              <button type="submit" style={styles.adminButton}>
                🚪 LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        onClick={handleLogout}
        style={styles.logoutButton}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(45deg, #666, #444)';
        }}
      >
        🚪 LOGOUT
      </button>
      
      <div style={styles.adminContainer}>
        <div style={styles.adminHeader}>
          <h1 style={styles.adminTitle}>🎵 WMVL RADIO ADMIN 🎵</h1>
          <p style={styles.adminSubtitle}>Content Management Dashboard</p>
        </div>

        {/* Stats Overview */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{galleryItems.length}</span>
            <div style={styles.statLabel}>Gallery Items</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{events.length}</span>
            <div style={styles.statLabel}>Events</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{galleryItems.filter(item => item.is_featured).length}</span>
            <div style={styles.statLabel}>Featured Photos</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{events.filter(event => event.is_featured).length}</span>
            <div style={styles.statLabel}>Featured Events</div>
          </div>
        </div>

        <div style={styles.adminSections}>
          {/* Gallery Management Section */}
          <div style={styles.adminSection}>
            <h2 style={styles.adminSectionTitle}>📸 Gallery Management</h2>
            
            <form onSubmit={handleGallerySubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Title:</label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                  style={styles.formInput}
                  placeholder="Enter image title"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description:</label>
                <textarea
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                  style={styles.formTextarea}
                  placeholder="Enter image description"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Image File:</label>
                <input
                  type="file"
                  onChange={(e) => setGalleryForm({...galleryForm, file: e.target.files[0]})}
                  style={styles.formInput}
                  accept="image/*"
                  required
                />
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={galleryForm.is_featured}
                  onChange={(e) => setGalleryForm({...galleryForm, is_featured: e.target.checked})}
                />
                <label style={styles.formLabel}>Featured Image</label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Tags (comma-separated):</label>
                <input
                  type="text"
                  value={galleryForm.tags}
                  onChange={(e) => setGalleryForm({...galleryForm, tags: e.target.value})}
                  style={styles.formInput}
                  placeholder="concert, live, radio"
                />
              </div>

              <button 
                type="submit" 
                style={styles.adminButton}
                disabled={loading.gallery}
              >
                {loading.gallery ? '⏳ Uploading...' : '📤 Upload to Gallery'}
              </button>
            </form>

            {messages.gallery && (
              <div style={{
                ...styles.message,
                color: messages.gallery.includes('✅') ? '#00ff00' : '#ff0000',
                borderColor: messages.gallery.includes('✅') ? '#00ff00' : '#ff0000'
              }}>
                {messages.gallery}
              </div>
            )}

            <div style={styles.itemsList}>
              {galleryItems.length > 0 ? galleryItems.map(item => (
                <div key={item.id} style={styles.adminItem}>
                  <div style={styles.adminItemInfo}>
                    {item.image_filename && (
                      <img 
                        src={buildUploadUrl(item.image_filename)}
                        alt={item.title}
                        style={styles.previewImage}
                      />
                    )}
                    <div>
                      <h4 style={styles.adminItemTitle}>{item.title}</h4>
                      <p style={styles.adminItemDesc}>
                        {item.description || 'No description'}
                      </p>
                      <p style={styles.adminItemDate}>
                        Uploaded: {new Date(item.upload_date).toLocaleDateString()}
                      </p>
                      {item.is_featured && (
                        <p style={{...styles.adminItemDate, color: '#ff0000'}}>⭐ Featured</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteGalleryItem(item.id)}
                      style={styles.deleteButton}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(45deg, #666, #444)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div style={styles.emptyState}>No gallery items yet</div>
              )}
            </div>
          </div>

          {/* Events Management Section */}
          <div style={styles.adminSection}>
            <h2 style={styles.adminSectionTitle}>🎉 Events Management</h2>
            
            <form onSubmit={handleEventSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Event Title:</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  style={styles.formInput}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description:</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  style={styles.formTextarea}
                  placeholder="Enter event description"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Event Date & Time:</label>
                <input
                  type="datetime-local"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Location:</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  style={styles.formInput}
                  placeholder="Enter event location"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Event Image (optional):</label>
                <input
                  type="file"
                  onChange={(e) => setEventForm({...eventForm, image_file: e.target.files[0]})}
                  style={styles.formInput}
                  accept="image/*"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Ticket URL (optional):</label>
                <input
                  type="url"
                  value={eventForm.ticket_url}
                  onChange={(e) => setEventForm({...eventForm, ticket_url: e.target.value})}
                  style={styles.formInput}
                  placeholder="https://tickets.example.com"
                />
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={eventForm.is_featured}
                  onChange={(e) => setEventForm({...eventForm, is_featured: e.target.checked})}
                />
                <label style={styles.formLabel}>Featured Event</label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Tags (comma-separated):</label>
                <input
                  type="text"
                  value={eventForm.tags}
                  onChange={(e) => setEventForm({...eventForm, tags: e.target.value})}
                  style={styles.formInput}
                  placeholder="concert, live, special"
                />
              </div>

              <button 
                type="submit" 
                style={styles.adminButton}
                disabled={loading.events}
              >
                {loading.events ? '⏳ Creating...' : '🎯 Create Event'}
              </button>
            </form>

            {messages.events && (
              <div style={{
                ...styles.message,
                color: messages.events.includes('✅') ? '#00ff00' : '#ff0000',
                borderColor: messages.events.includes('✅') ? '#00ff00' : '#ff0000'
              }}>
                {messages.events}
              </div>
            )}

            <div style={styles.itemsList}>
              {events.length > 0 ? events.map(item => (
                <div key={item.id} style={styles.adminItem}>
                  <div style={styles.adminItemInfo}>
                    <div>
                      <h4 style={styles.adminItemTitle}>{item.title}</h4>
                      <p style={styles.adminItemDesc}>{item.description}</p>
                      <p style={styles.adminItemDate}>
                        📅 {new Date(item.event_date).toLocaleDateString()} at{' '}
                        {new Date(item.event_date).toLocaleTimeString()}
                      </p>
                      {item.location && (
                        <p style={styles.adminItemDate}>📍 {item.location}</p>
                      )}
                      {item.is_featured && (
                        <p style={{...styles.adminItemDate, color: '#ff0000'}}>⭐ Featured</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteEvent(item.id)}
                      style={styles.deleteButton}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(45deg, #666, #444)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div style={styles.emptyState}>No events yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;