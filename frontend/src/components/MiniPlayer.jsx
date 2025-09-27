import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';

const MiniPlayer = () => {
  const { isPlaying, loading, error, volume, togglePlay, setVolume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show mini player on home page
  const isHomePage = window.location.pathname === '/';
  if (isHomePage) return null;

  const getButtonText = () => {
    if (loading) return '⏳';
    if (error) return '❌';
    if (isPlaying) return '⏸';
    return '▶';
  };

  const styles = {
    miniPlayer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #ff0000',
      borderRadius: '10px',
      padding: '15px',
      zIndex: 1000,
      fontFamily: "'Courier New', monospace",
      color: '#ffffff',
      boxShadow: '0 4px 20px rgba(255, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      minWidth: '200px',
      transition: 'all 0.3s ease'
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isExpanded ? '15px' : '0'
    },
    
    title: {
      fontSize: '0.9em',
      color: '#ff0000',
      fontWeight: 'bold',
      letterSpacing: '0.05em'
    },
    
    playButton: {
      background: isPlaying ? '#ff0000' : 'transparent',
      border: '2px solid #ff0000',
      color: isPlaying ? '#ffffff' : '#ff0000',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      cursor: error ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      fontFamily: "'Courier New', monospace",
      opacity: loading || error ? 0.7 : 1
    },
    
    expandButton: {
      background: 'transparent',
      border: 'none',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '12px',
      marginLeft: '10px',
      transition: 'color 0.3s ease'
    },
    
    controls: {
      display: isExpanded ? 'block' : 'none'
    },
    
    volumeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '10px'
    },
    
    volumeLabel: {
      fontSize: '0.8em',
      color: '#cccccc'
    },
    
    volumeSlider: {
      flex: 1,
      height: '4px',
      background: '#333333',
      borderRadius: '2px',
      outline: 'none',
      cursor: 'pointer'
    },
    
    status: {
      fontSize: '0.75em',
      color: '#888888',
      marginTop: '8px',
      textAlign: 'center'
    },
    
    errorStatus: {
      color: '#ff0000'
    }
  };

  return (
    <div style={styles.miniPlayer}>
      <div style={styles.header}>
        <div style={styles.title}>WMVL RADIO</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={error ? undefined : togglePlay}
            style={styles.playButton}
            disabled={loading || error}
            onMouseEnter={(e) => {
              if (!isPlaying && !loading && !error) {
                e.target.style.background = '#ff0000';
                e.target.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isPlaying && !loading && !error) {
                e.target.style.background = 'transparent';
                e.target.style.color = '#ff0000';
              }
            }}
          >
            {getButtonText()}
          </button>
          <button
            style={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={(e) => e.target.style.color = '#ff0000'}
            onMouseLeave={(e) => e.target.style.color = '#ffffff'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>
      
      <div style={styles.controls}>
        <div style={styles.volumeContainer}>
          <span style={styles.volumeLabel}>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={styles.volumeSlider}
          />
          <span style={styles.volumeLabel}>{Math.round(volume * 100)}%</span>
        </div>
        
        <div style={{
          ...styles.status,
          ...(error ? styles.errorStatus : {})
        }}>
          {loading ? 'Connecting...' : 
           error ? 'Stream offline' : 
           isPlaying ? '🔴 Live' : 'Ready to play'}
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;