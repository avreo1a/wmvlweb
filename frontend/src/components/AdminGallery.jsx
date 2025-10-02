import React, { useState, useEffect, useRef } from 'react';
import { buildApiUrl, buildUploadUrl } from '../utils/api';

const AdminGallery = () => {
  // State management
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState({ gallery: false, upload: false });
  const [messages, setMessages] = useState({ gallery: '', upload: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  
  // Form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null,
    is_featured: false,
    tags: ''
  });

  // Refs
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  // Load gallery items on component mount
  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      setLoading(prev => ({ ...prev, gallery: true }));
      const response = await fetch(buildApiUrl('/api/gallery'), {
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setGalleryItems(result.gallery || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      setMessages(prev => ({ ...prev, gallery: `Error loading gallery: ${error.message}` }));
    } finally {
      setLoading(prev => ({ ...prev, gallery: false }));
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessages(prev => ({ ...prev, upload: 'Please select a valid image file.' }));
      return;
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setMessages(prev => ({ ...prev, upload: 'File too large. Maximum size is 100MB.' }));
      return;
    }

    setUploadForm(prev => ({ ...prev, file }));
    setMessages(prev => ({ ...prev, upload: '' }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      setMessages(prev => ({ ...prev, upload: 'Please select a file to upload.' }));
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('file', uploadForm.file);
    formData.append('is_featured', uploadForm.is_featured.toString());
    formData.append('tags', uploadForm.tags);

    try {
      setLoading(prev => ({ ...prev, upload: true }));
      setShowProgress(true);
      setUploadProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 30;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 100);

      console.log('Uploading to:', buildApiUrl('/admin/upload'));
      console.log('File size:', uploadForm.file.size, 'bytes');

      const response = await fetch(buildApiUrl('/admin/upload'), {
        method: 'POST',
        body: formData,
        credentials: 'omit'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();
      console.log('Upload response:', result);

      if (response.ok && result.success) {
        setMessages(prev => ({ ...prev, upload: '✅ Image uploaded successfully!' }));
        setUploadForm({
          title: '',
          description: '',
          file: null,
          is_featured: false,
          tags: ''
        });
        fileInputRef.current.value = '';
        loadGalleryItems();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessages(prev => ({ ...prev, upload: '' }));
        }, 3000);
      } else {
        const errorMsg = result.error || `Server error: ${response.status} ${response.statusText}`;
        setMessages(prev => ({ ...prev, upload: `❌ Error: ${errorMsg}` }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessages(prev => ({ ...prev, upload: `❌ Network error: ${error.message}` }));
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
      setTimeout(() => {
        setShowProgress(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(buildApiUrl(`/api/gallery/${id}`), {
        method: 'DELETE',
        credentials: 'omit'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setMessages(prev => ({ ...prev, gallery: '✅ Image deleted successfully!' }));
        loadGalleryItems();
        setTimeout(() => {
          setMessages(prev => ({ ...prev, gallery: '' }));
        }, 3000);
      } else {
        const errorMsg = result.error || `Server error: ${response.status}`;
        setMessages(prev => ({ ...prev, gallery: `❌ Error deleting item: ${errorMsg}` }));
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessages(prev => ({ ...prev, gallery: `❌ Network error: ${error.message}` }));
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const response = await fetch(buildApiUrl(`/api/gallery/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_featured: !currentFeatured
        }),
        credentials: 'omit'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setMessages(prev => ({ 
          ...prev, 
          gallery: `✅ Image ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!` 
        }));
        loadGalleryItems();
        setTimeout(() => {
          setMessages(prev => ({ ...prev, gallery: '' }));
        }, 3000);
      } else {
        const errorMsg = result.error || `Server error: ${response.status}`;
        setMessages(prev => ({ ...prev, gallery: `❌ Error updating item: ${errorMsg}` }));
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessages(prev => ({ ...prev, gallery: `❌ Network error: ${error.message}` }));
    }
  };

  // Calculate stats
  const stats = {
    total: galleryItems.length,
    featured: galleryItems.filter(item => item.is_featured).length,
    thisMonth: galleryItems.filter(item => {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      return new Date(item.upload_date) >= thisMonth;
    }).length
  };

  const styles = {
    container: {
      fontFamily: "'Courier New', monospace",
      backgroundColor: '#000000',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '100px 20px 20px',
    },
    
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      borderBottom: '2px solid #ff0000',
      paddingBottom: '20px'
    },
    
    title: {
      color: '#ff0000',
      fontSize: '3rem',
      textShadow: '0 0 10px #ff0000',
      marginBottom: '10px'
    },
    
    subtitle: {
      color: '#cccccc',
      fontSize: '1.2rem'
    },
    
    statsBar: {
      background: 'rgba(0, 0, 0, 0.6)',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: '20px'
    },
    
    statItem: {
      textAlign: 'center'
    },
    
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#ff0000',
      display: 'block'
    },
    
    statLabel: {
      color: '#cccccc',
      fontSize: '0.9rem',
      marginTop: '5px'
    },
    
    adminGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '30px',
      marginBottom: '40px'
    },
    
    uploadSection: {
      background: 'rgba(255, 0, 0, 0.1)',
      border: '2px solid #ff0000',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
    },
    
    gallerySection: {
      background: 'rgba(255, 0, 0, 0.05)',
      border: '1px solid #ff0000',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)'
    },
    
    sectionTitle: {
      color: '#ff0000',
      marginBottom: '25px',
      fontSize: '1.8rem',
      textShadow: '0 0 5px #ff0000'
    },
    
    formGroup: {
      marginBottom: '20px'
    },
    
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#ffffff',
      fontWeight: 'bold'
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
      minHeight: '80px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease'
    },
    
    fileUploadArea: {
      border: '3px dashed #ff0000',
      borderRadius: '10px',
      padding: '40px',
      textAlign: 'center',
      background: 'rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    
    fileUploadAreaHover: {
      background: 'rgba(255, 0, 0, 0.1)',
      borderColor: '#ff6666'
    },
    
    uploadIcon: {
      fontSize: '3rem',
      color: '#ff0000',
      marginBottom: '15px'
    },
    
    uploadText: {
      color: '#ffffff',
      fontSize: '1.2rem',
      marginBottom: '10px'
    },
    
    uploadSubtext: {
      color: '#cccccc',
      fontSize: '0.9rem'
    },
    
    filePreview: {
      marginTop: '20px',
      padding: '15px',
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '8px'
    },
    
    previewImage: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: '5px'
    },
    
    fileInfo: {
      marginTop: '10px',
      color: '#cccccc',
      fontSize: '0.9rem'
    },
    
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px'
    },
    
    button: {
      background: 'linear-gradient(45deg, #ff0000, #cc0000)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '0.05em'
    },
    
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    },
    
    buttonSecondary: {
      background: 'linear-gradient(45deg, #333, #555)'
    },
    
    buttonSmall: {
      padding: '8px 15px',
      fontSize: '12px'
    },
    
    progressBar: {
      width: '100%',
      height: '6px',
      background: '#333',
      borderRadius: '3px',
      margin: '15px 0',
      overflow: 'hidden'
    },
    
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #ff0000, #ff6666)',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
      width: `${uploadProgress}%`
    },
    
    message: {
      padding: '15px',
      borderRadius: '5px',
      margin: '20px 0',
      fontWeight: 'bold',
      border: '1px solid'
    },
    
    messageSuccess: {
      background: 'rgba(0, 255, 0, 0.2)',
      borderColor: '#00ff00',
      color: '#00ff00'
    },
    
    messageError: {
      background: 'rgba(255, 0, 0, 0.2)',
      borderColor: '#ff0000',
      color: '#ff0000'
    },
    
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    
    galleryItem: {
      background: 'rgba(0, 0, 0, 0.6)',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '15px',
      transition: 'all 0.3s ease'
    },
    
    galleryItemHover: {
      borderColor: '#ff0000',
      boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)'
    },
    
    galleryImage: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '5px',
      marginBottom: '10px'
    },
    
    galleryItemTitle: {
      color: '#ff0000',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    
    galleryItemDesc: {
      color: '#cccccc',
      fontSize: '0.9rem',
      marginBottom: '10px'
    },
    
    galleryItemMeta: {
      color: '#888888',
      fontSize: '0.8rem',
      marginBottom: '10px'
    },
    
    galleryItemActions: {
      display: 'flex',
      gap: '10px'
    },
    
    loading: {
      textAlign: 'center',
      color: '#ff0000',
      fontSize: '1.2rem',
      padding: '20px'
    },
    
    emptyState: {
      textAlign: 'center',
      color: '#666',
      fontSize: '1.1rem',
      padding: '40px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📸 GALLERY ADMIN</h1>
        <p style={styles.subtitle}>Manage your radio station's photo gallery</p>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{stats.total}</span>
          <div style={styles.statLabel}>Total Images</div>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{stats.featured}</span>
          <div style={styles.statLabel}>Featured</div>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{stats.thisMonth}</span>
          <div style={styles.statLabel}>This Month</div>
        </div>
      </div>

      <div style={styles.adminGrid}>
        {/* Upload Section */}
        <div style={styles.uploadSection}>
          <h2 style={styles.sectionTitle}>Upload New Image</h2>
          
          <form onSubmit={handleUploadSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Image Title:</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                style={styles.formInput}
                placeholder="Enter image title"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Description:</label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                style={styles.formTextarea}
                placeholder="Enter image description"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Image File:</label>
              <div
                style={styles.fileUploadArea}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  accept="image/*"
                  style={{ display: 'none' }}
                  required
                />
                <div style={styles.uploadIcon}>📁</div>
                <div style={styles.uploadText}>
                  {uploadForm.file ? uploadForm.file.name : 'Click or drag image here'}
                </div>
                <div style={styles.uploadSubtext}>
                  Supports: JPG, PNG, GIF, WEBP (Max: 100MB)
                </div>
              </div>
              
              {uploadForm.file && (
                <div style={styles.filePreview}>
                  <img
                    src={URL.createObjectURL(uploadForm.file)}
                    alt="Preview"
                    style={styles.previewImage}
                  />
                  <div style={styles.fileInfo}>
                    <strong>File:</strong> {uploadForm.file.name}<br />
                    <strong>Size:</strong> {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB<br />
                    <strong>Type:</strong> {uploadForm.file.type}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tags (comma-separated):</label>
              <input
                type="text"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                style={styles.formInput}
                placeholder="concert, live, radio"
              />
            </div>

            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                checked={uploadForm.is_featured}
                onChange={(e) => setUploadForm(prev => ({ ...prev, is_featured: e.target.checked }))}
              />
              <label style={styles.formLabel}>Featured Image</label>
            </div>

            {showProgress && (
              <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading.upload ? styles.buttonDisabled : {})
              }}
              disabled={loading.upload}
            >
              {loading.upload ? '⏳ Uploading...' : '📤 Upload Image'}
            </button>
          </form>

          {messages.upload && (
            <div style={{
              ...styles.message,
              ...(messages.upload.includes('✅') ? styles.messageSuccess : styles.messageError)
            }}>
              {messages.upload}
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div style={styles.gallerySection}>
          <h2 style={styles.sectionTitle}>Current Gallery</h2>
          
          {messages.gallery && (
            <div style={{
              ...styles.message,
              ...(messages.gallery.includes('✅') ? styles.messageSuccess : styles.messageError)
            }}>
              {messages.gallery}
            </div>
          )}
          
          {loading.gallery ? (
            <div style={styles.loading}>Loading gallery...</div>
          ) : galleryItems.length === 0 ? (
            <div style={styles.emptyState}>No images in gallery yet</div>
          ) : (
            <div style={styles.galleryGrid}>
              {galleryItems.map(item => (
                <div key={item.id} style={styles.galleryItem}>
                  <img
                    src={buildUploadUrl(item.image_filename)}
                    alt={item.title}
                    style={styles.galleryImage}
                  />
                  <div style={styles.galleryItemTitle}>{item.title}</div>
                  <div style={styles.galleryItemDesc}>
                    {item.description || 'No description'}
                  </div>
                  <div style={styles.galleryItemMeta}>
                    Uploaded: {new Date(item.upload_date).toLocaleDateString()}
                    {item.is_featured && (
                      <><br /><span style={{ color: '#ff0000' }}>⭐ Featured</span></>
                    )}
                  </div>
                  <div style={styles.galleryItemActions}>
                    <button
                      onClick={() => deleteGalleryItem(item.id)}
                      style={{
                        ...styles.button,
                        ...styles.buttonSecondary,
                        ...styles.buttonSmall
                      }}
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={() => toggleFeatured(item.id, item.is_featured)}
                      style={{
                        ...styles.button,
                        ...styles.buttonSecondary,
                        ...styles.buttonSmall
                      }}
                    >
                      {item.is_featured ? '⭐' : '☆'} Feature
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;