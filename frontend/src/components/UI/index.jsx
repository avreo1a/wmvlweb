import React from 'react';
import { styles } from '../../styles/radioStyles.jsx';
import { radioConfig } from '../../data/tracks';


const currentYear = new Date().getFullYear();

export const Logo = ({ isMobile = false }) => (
  <div style={styles.logo(isMobile)}>
    WMVL
  </div>
);

export const Tagline = () => (
  <div style={styles.tagline}>
    bleeding-edge digital radio
  </div>
);

export const LiveStatus = () => (
  <div style={styles.liveStatus}>
    <span style={styles.liveIndicator}>●</span>
    <span>LIVE • 24/7</span>
  </div>
);

export const PlayButton = ({ isPlaying, loading, error, onClick }) => {
  const handleMouseOver = (e) => {
    if (!isPlaying && !loading) {
      e.currentTarget.style.backgroundColor = '#ffffff';
      e.currentTarget.style.color = '#000000';
    }
  };

  const handleMouseOut = (e) => {
    if (!isPlaying && !loading) {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#ffffff';
    }
  };

  const getButtonText = () => {
    if (loading) return 'LOADING...';
    if (error) return 'UNAVAILABLE';
    if (isPlaying) return '⏸ PLAYING';
    return '▶ LISTEN LIVE';
  };

  const getButtonStyle = () => {
    let style = styles.playButton(isPlaying);
    if (loading) {
      style = { ...style, opacity: 0.7, cursor: 'wait' };
    } else if (error) {
      style = { ...style, borderColor: '#ff0000', color: '#ff0000', cursor: 'not-allowed' };
    }
    return style;
  };

  return (
    <button
      onClick={error ? undefined : onClick}
      style={getButtonStyle()}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      disabled={loading || error}
      aria-label={loading ? 'Loading stream' : error ? 'Stream unavailable' : isPlaying ? 'Pause radio' : 'Play radio'}
    >
      {getButtonText()}
    </button>
  );
};

export const NowPlaying = ({ track }) => (
  <div style={styles.nowPlaying}>
    <div style={styles.trackTitle}>
      Under Construction
    </div>
    <div style={styles.artistName}>
      Track info coming soon
    </div>
  </div>
);

export const GenreNote = ({ isLive = true }) => (
  <div style={styles.genreNote}>
    broadcasting experimental, electronic, and avant-garde music
  </div>
);

export const Stats = ({ listeners }) => (
  <div style={styles.stats}>
    <div style={styles.stat}>
      <div style={styles.statNumber}>{listeners}</div>
      <div style={styles.statLabel}>listeners</div>
    </div>
    
    <div style={styles.stat}>
      <div style={styles.statNumber}>{radioConfig.bitrate}</div>
      <div style={styles.statLabel}>bitrate</div>
    </div>
    
    <div style={styles.stat}>
      <div style={styles.statNumber}>{radioConfig.uptime}</div>
      <div style={styles.statLabel}>uptime</div>
    </div>
  </div>
);



export const Footer = () => (
  <div style={styles.footer}>
    <div style={styles.contact}>
      email: <a 
        href="mailto:wmvlradio@mville.edu" 
        style={styles.contactLink}
        aria-label="Contact WMVL via email"
      >
        wmvlradio@mville.edu
      </a>
    </div>
    <div style={styles.socialLinks}>
      <a 
        href="https://instagram.com/wmvlradio" 
        style={styles.instagramLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow WMVL on Instagram"
      >
        <img 
          src="/instagram-icon.svg" 
          alt="Instagram" 
          style={styles.instagramIcon}
        />
      </a>
    </div>
    <div>
      <p>© {currentYear} WMVL • digital radio collective</p>
      <p style={styles.credits}>
        Site built with ❤️ by{' '}
        <a 
          href="https://www.linkedin.com/in/christian-krause-12a5a41b7/"
          style={styles.developerLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Christian Krause on LinkedIn"
          onMouseEnter={(e) => {
            e.target.style.color = '#ff0000';
            e.target.style.textShadow = '0 0 8px #ff0000';
            e.target.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#888888';
            e.target.style.textShadow = 'none';
            e.target.style.textDecoration = 'none';
          }}
        >
          Christian Krause
        </a>
      </p>
    </div>
  </div>
);