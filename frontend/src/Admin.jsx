import { useState, useEffect } from 'react';

const adminStyles = {
  container: {
    fontFamily: "'Courier New', monospace",
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '20px'
  },
  adminContainer: {
    maxWidth: '1200px',
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
    fontSize: '2.5rem',
    textShadow: '0 0 10px #ff0000',
    marginBottom: '10px',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.1em'
  },
  adminSubtitle: {
    color: '#cccccc',
    fontSize: '1.1em',
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
    border: '1px solid #ff0000',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
  },
  adminSectionTitle: {
    color: '#ff0000',
    marginBottom: '20px',
    fontSize: '1.8rem',
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
    boxSizing: 'border-box'
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
    boxSizing: 'border-box'
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
    padding: '12px 25px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.05em'
  },
  message: {
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    fontWeight: 'bold',
    fontFamily: "'Courier New', monospace"
  },
  itemsList: {
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid #333',
    borderRadius: '5px',
    background: 'rgba(0, 0, 0, 0.5)'
  },
  adminItem: {
    padding: '15px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  adminItemInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  adminItemTitle: {
    color: '#ff0000',
    marginBottom: '5px',
    fontFamily: "'Courier New', monospace"
  },
  adminItemDesc: {
    color: '#ccc',
    fontSize: '0.9rem',
    marginBottom: '3px',
    fontFamily: "'Courier New', monospace"
  },
  adminItemDate: {
    color: '#888',
    fontSize: '0.8rem',
    fontFamily: "'Courier New', monospace"
  },
  deleteButton: {
    background: 'linear-gradient(45deg, #333, #555)',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '3px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace"
  },
  previewImage: {
    maxWidth: '100px',
    maxHeight: '100px',
    borderRadius: '5px',
    marginRight: '15px',
    objectFit: 'cover'
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#ccc',
    fontFamily: "'Courier New', monospace"
  }
};

const Admin = () => {
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
    image_url: '',
    ticket_url: '',
    is_featured: false,
    tags: ''
  });
  const [messages, setMessages] = useState({ gallery: '', events: '' });
  const [loading, setLoading] = useState({ gallery: false, events: false });

  useEffect(() => {
    loadGalleryItems();
    loadEvents();
  }, []);

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

    try {
      const response = await fetch(buildApiUrl('/api/events'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventForm)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessages({ ...messages, events: '✅ Event created successfully!' });
        setEventForm({
          title: '', description: '', event_date: '', location: '',
          image_url: '', ticket_url: '', is_featured: false, tags: ''
        });
        loadEvents();
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

  return (
    <div style={adminStyles.container}>
      <div style={adminStyles.adminContainer}>
        <div style={adminStyles.adminHeader}>
          <h1 style={adminStyles.adminTitle}>🎵 WMVL RADIO ADMIN PANEL 🎵</h1>
          <p style={adminStyles.adminSubtitle}>Manage your gallery and events</p>
        </div>

        <div style={adminStyles.adminSections}>
          {/* Gallery Management Section */}
          <div style={adminStyles.adminSection}>
            <h2 style={adminStyles.adminSectionTitle}>📸 Gallery Management</h2>
            
            <form onSubmit={handleGallerySubmit}>
              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Title:</label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                  style={adminStyles.formInput}
                  placeholder="Enter image title"
                  required
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Description:</label>
                <textarea
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                  style={adminStyles.formTextarea}
                  placeholder="Enter image description"
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Image File:</label>
                <input
                  type="file"
                  onChange={(e) => setGalleryForm({...galleryForm, file: e.target.files[0]})}
                  style={adminStyles.formInput}
                  accept="image/*"
                  required
                />
              </div>

              <div style={adminStyles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={galleryForm.is_featured}
                  onChange={(e) => setGalleryForm({...galleryForm, is_featured: e.target.checked})}
                />
                <label style={adminStyles.formLabel}>Featured Image</label>
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Tags (comma-separated):</label>
                <input
                  type="text"
                  value={galleryForm.tags}
                  onChange={(e) => setGalleryForm({...galleryForm, tags: e.target.value})}
                  style={adminStyles.formInput}
                  placeholder="concert, live, radio"
                />
              </div>

              <button 
                type="submit" 
                style={adminStyles.adminButton}
                disabled={loading.gallery}
              >
                {loading.gallery ? '⏳ Uploading...' : '📤 Upload to Gallery'}
              </button>
            </form>

            {messages.gallery && (
              <div style={{
                ...adminStyles.message,
                color: messages.gallery.includes('✅') ? '#00ff00' : '#ff0000'
              }}>
                {messages.gallery}
              </div>
            )}

            <h3 style={{...adminStyles.adminSectionTitle, fontSize: '1.2rem', margin: '30px 0 15px 0'}}>Current Gallery Items</h3>
            <div style={adminStyles.itemsList}>
              {galleryItems.length > 0 ? galleryItems.map(item => (
                <div key={item.id} style={adminStyles.adminItem}>
                  <div style={adminStyles.adminItemInfo}>
                    {item.image_filename && (
                      <img 
                        src={buildUploadUrl(item.image_filename)}
                        alt={item.title}
                        style={adminStyles.previewImage}
                      />
                    )}
                    <div>
                      <h4 style={adminStyles.adminItemTitle}>{item.title}</h4>
                      <p style={adminStyles.adminItemDesc}>
                        {item.description || 'No description'}
                      </p>
                      <p style={adminStyles.adminItemDate}>
                        Uploaded: {new Date(item.upload_date).toLocaleDateString()}
                      </p>
                      {item.is_featured && (
                        <p style={{...adminStyles.adminItemDate, color: '#ff0000'}}>⭐ Featured</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteGalleryItem(item.id)}
                      style={adminStyles.deleteButton}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div style={adminStyles.emptyState}>No gallery items yet</div>
              )}
            </div>
          </div>

          {/* Events Management Section */}
          <div style={adminStyles.adminSection}>
            <h2 style={adminStyles.adminSectionTitle}>🎉 Events Management</h2>
            
            <form onSubmit={handleEventSubmit}>
              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Event Title:</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  style={adminStyles.formInput}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Description:</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  style={adminStyles.formTextarea}
                  placeholder="Enter event description"
                  required
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Event Date & Time:</label>
                <input
                  type="datetime-local"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                  style={adminStyles.formInput}
                  required
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Location:</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  style={adminStyles.formInput}
                  placeholder="Enter event location"
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Image URL (optional):</label>
                <input
                  type="url"
                  value={eventForm.image_url}
                  onChange={(e) => setEventForm({...eventForm, image_url: e.target.value})}
                  style={adminStyles.formInput}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Ticket URL (optional):</label>
                <input
                  type="url"
                  value={eventForm.ticket_url}
                  onChange={(e) => setEventForm({...eventForm, ticket_url: e.target.value})}
                  style={adminStyles.formInput}
                  placeholder="https://tickets.example.com"
                />
              </div>

              <div style={adminStyles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={eventForm.is_featured}
                  onChange={(e) => setEventForm({...eventForm, is_featured: e.target.checked})}
                />
                <label style={adminStyles.formLabel}>Featured Event</label>
              </div>

              <div style={adminStyles.formGroup}>
                <label style={adminStyles.formLabel}>Tags (comma-separated):</label>
                <input
                  type="text"
                  value={eventForm.tags}
                  onChange={(e) => setEventForm({...eventForm, tags: e.target.value})}
                  style={adminStyles.formInput}
                  placeholder="concert, live, special"
                />
              </div>

              <button 
                type="submit" 
                style={adminStyles.adminButton}
                disabled={loading.events}
              >
                {loading.events ? '⏳ Creating...' : '🎯 Create Event'}
              </button>
            </form>

            {messages.events && (
              <div style={{
                ...adminStyles.message,
                color: messages.events.includes('✅') ? '#00ff00' : '#ff0000'
              }}>
                {messages.events}
              </div>
            )}

            <h3 style={{...adminStyles.adminSectionTitle, fontSize: '1.2rem', margin: '30px 0 15px 0'}}>Current Events</h3>
            <div style={adminStyles.itemsList}>
              {events.length > 0 ? events.map(item => (
                <div key={item.id} style={adminStyles.adminItem}>
                  <div style={adminStyles.adminItemInfo}>
                    <div>
                      <h4 style={adminStyles.adminItemTitle}>{item.title}</h4>
                      <p style={adminStyles.adminItemDesc}>{item.description}</p>
                      <p style={adminStyles.adminItemDate}>
                        📅 {new Date(item.event_date).toLocaleDateString()} at{' '}
                        {new Date(item.event_date).toLocaleTimeString()}
                      </p>
                      {item.location && (
                        <p style={adminStyles.adminItemDate}>📍 {item.location}</p>
                      )}
                      {item.is_featured && (
                        <p style={{...adminStyles.adminItemDate, color: '#ff0000'}}>⭐ Featured</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteEvent(item.id)}
                      style={adminStyles.deleteButton}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div style={adminStyles.emptyState}>No events yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;