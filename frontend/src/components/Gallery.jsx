import React, { useState, useEffect, useRef } from 'react';

// Lazy Image Component
const LazyImage = ({ src, alt, style, onClick, onMouseEnter, onMouseLeave }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div ref={imgRef} style={style}>
      {inView && (
        <>
          <img
            src={src}
            alt={alt}
            style={{
              ...style,
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            loading="lazy"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onLoad={handleLoad}
          />
          {!loaded && (
            <div style={{
              ...style,
              position: 'absolute',
              backgroundColor: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666666',
              fontSize: '0.8em',
              fontFamily: "'Courier New', monospace"
            }}>
              Loading...
            </div>
          )}
        </>
      )}
      {!inView && (
        <div style={{
          ...style,
          backgroundColor: '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666666',
          fontSize: '0.8em',
          fontFamily: "'Courier New', monospace"
        }}>
          •••
        </div>
      )}
    </div>
  );
};

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  // Fetch photos from backend
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gallery');
        const data = await response.json();
        setPhotos(data.gallery || []);
      } catch (error) {
        console.error('Failed to load photos:', error);
      }
      setLoading(false);
    };
    loadPhotos();
  }, []);

  // Open lightbox
  const openLightbox = (index) => {
    setLightbox({ open: true, index });
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 });
    document.body.style.overflow = 'unset';
  };

  // Navigate photos
  const nextPhoto = () => {
    setLightbox(prev => ({
      ...prev,
      index: prev.index === photos.length - 1 ? 0 : prev.index + 1
    }));
  };

  const prevPhoto = () => {
    setLightbox(prev => ({
      ...prev,
      index: prev.index === 0 ? photos.length - 1 : prev.index - 1
    }));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!lightbox.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [lightbox.open, photos.length]);

  // Styles
  const styles = {
    container: {
      fontFamily: "'Courier New', monospace",
      backgroundColor: '#000000',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '100px 20px 20px',
    },
    
    title: {
      fontSize: '3em',
      textAlign: 'center',
      marginBottom: '40px',
      color: '#ffffff',
    },
    
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    
    photo: {
      width: '100%',
      height: '300px',
      objectFit: 'cover',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
    },
    
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    
    lightboxPhoto: {
      maxWidth: '90vw',
      maxHeight: '90vh',
      objectFit: 'contain',
    },
    
    closeBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'none',
      border: '2px solid #ff0000',
      color: '#ffffff',
      fontSize: '30px',
      cursor: 'pointer',
      padding: '10px',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
    },
    
    navBtn: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid #ff0000',
      color: '#ffffff',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '15px 20px',
      borderRadius: '50%',
      fontFamily: "'Courier New', monospace",
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    counter: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '10px 20px',
      borderRadius: '20px',
      border: '1px solid #ff0000',
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Gallery</h1>
        <p style={{ textAlign: 'center' }}>Loading photos...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gallery</h1>
      
      {photos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No photos yet.</p>
      ) : (
        <div style={styles.grid}>
          {photos.map((photo, index) => (
            <LazyImage
              key={photo.id}
              src={`http://localhost:5000/uploads/${photo.image_filename}`}
              alt="Gallery photo"
              style={{...styles.photo, position: 'relative'}}
              onClick={() => openLightbox(index)}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          ))}
        </div>
      )}

      {lightbox.open && (
        <div style={styles.overlay} onClick={closeLightbox}>
          <img
            src={`http://localhost:5000/uploads/${photos[lightbox.index].image_filename}`}
            alt="Lightbox photo"
            style={styles.lightboxPhoto}
            onClick={(e) => e.stopPropagation()}
          />
          
          <button style={styles.closeBtn} onClick={closeLightbox}>×</button>
          
          <button 
            style={{ ...styles.navBtn, left: '50px' }} 
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
              e.target.style.color = '#ff0000';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              e.target.style.color = '#ffffff';
            }}
          >
            ‹
          </button>
          
          <button 
            style={{ ...styles.navBtn, right: '50px' }} 
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
              e.target.style.color = '#ff0000';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              e.target.style.color = '#ffffff';
            }}
          >
            ›
          </button>
          
          <div style={styles.counter}>
            {lightbox.index + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;