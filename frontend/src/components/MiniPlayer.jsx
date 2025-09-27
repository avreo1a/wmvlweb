import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';

const MiniPlayer = () => {
  const { isPlaying, loading, error, volume, togglePlay, setVolume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show mini player on home page
  const isHomePage = window.location.pathname === '/';
  if (isHomePage) return null;

  const getButtonText = () => {
    if (loading) return 'LOADING';
    if (error) return 'ERROR';
    if (isPlaying) return 'PAUSE';
    return 'PLAY';
  };

  const styles = {
    miniPlayer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#000000',
      border: '1px solid #ffffff',
      borderRadius: '0',
      padding: '12px',
      zIndex: 1000,
      fontFamily: "'Courier New', monospace",
      color: '#ffffff',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      minWidth: '220px',
      transition: 'all 0.3s ease',
      backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.95) 100%)',
      transform: isExpanded ? 'scale(1.02)' : 'scale(1)'
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isExpanded ? '12px' : '0',
      borderBottom: isExpanded ? '1px solid #333333' : 'none',
      paddingBottom: isExpanded ? '8px' : '0'
    },
    
    title: {
      fontSize: '0.75em',
      color: '#ffffff',
      fontWeight: 'bold',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      opacity: 0.9
    },
    
    liveIndicator: {
      color: '#ff0000',
      fontSize: '0.6em',
      marginLeft: '8px',
      animation: 'blink 1.5s infinite ease-in-out',
      display: 'inline-block',
      fontWeight: 'bold'
    },
    
    playButton: {
      background: isPlaying ? '#ffffff' : 'transparent',
      border: '1px solid #ffffff',
      color: isPlaying ? '#000000' : '#ffffff',
      borderRadius: '0',
      width: '35px',
      height: '35px',
      cursor: error ? 'not-allowed' : 'pointer',
      fontSize: '0.7em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      fontFamily: "'Courier New', monospace",
      fontWeight: 'bold',
      letterSpacing: '0.05em',
      opacity: loading || error ? 0.5 : 1,
      textTransform: 'uppercase'
    },
    
    expandButton: {
      background: 'transparent',
      border: '1px solid #333333',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '0.7em',
      marginLeft: '8px',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      borderRadius: '0'
    },
    
    controls: {
      display: isExpanded ? 'block' : 'none',
      animation: isExpanded ? 'fadeIn 0.3s ease' : 'none'
    },
    
    volumeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
      padding: '8px 0',
      borderTop: '1px solid #333333'
    },
    
    volumeLabel: {
      fontSize: '0.65em',
      color: '#ffffff',
      fontWeight: 'bold',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      minWidth: '25px'
    },
    
    volumeSlider: {
      flex: 1,
      height: '2px',
      background: '#333333',
      borderRadius: '0',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      WebkitAppearance: 'none'
    },
    
    volumePercent: {
      fontSize: '0.65em',
      color: '#ffffff',
      fontWeight: 'bold',
      minWidth: '30px',
      textAlign: 'right'
    },
    
    status: {
      fontSize: '0.65em',
      color: isPlaying ? '#ffffff' : '#888888',
      marginTop: '8px',
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px'
    },
    
    errorStatus: {
      color: '#ff0000'
    },
    
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(-5px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  };

  return (
    <div style={styles.miniPlayer}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={styles.title}>WMVL</span>
          {isPlaying && <span style={styles.liveIndicator}>●</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={error ? undefined : togglePlay}
            style={styles.playButton}
            disabled={loading || error}
            onMouseEnter={(e) => {
              if (!isPlaying && !loading && !error) {
                e.target.style.background = '#ffffff';
                e.target.style.color = '#000000';
              }
            }}
            onMouseLeave={(e) => {
              if (!isPlaying && !loading && !error) {
                e.target.style.background = 'transparent';
                e.target.style.color = '#ffffff';
              }
            }}
          >
            {getButtonText()}
          </button>
          <button
            style={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ffffff';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#333333';
              e.target.style.color = '#ffffff';
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>
      
      <div style={styles.controls}>
        <div style={styles.volumeContainer}>
          <span style={styles.volumeLabel}>VOL</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              ...styles.volumeSlider,
              backgroundImage: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume * 100}%, #333333 ${volume * 100}%, #333333 100%)`
            }}
          />
          <span style={styles.volumePercent}>{Math.round(volume * 100)}%</span>
        </div>
        
        <div style={{
          ...styles.status,
          ...(error ? styles.errorStatus : {})
        }}>
          {loading ? (
            <>CONNECTING<span style={styles.liveIndicator}>●</span></>
          ) : error ? (
            'OFFLINE'
          ) : isPlaying ? (
            <>LIVE<span style={styles.liveIndicator}>●</span></>
          ) : (
            'READY'
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;