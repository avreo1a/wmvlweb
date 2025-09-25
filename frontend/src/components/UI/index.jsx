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

export const PlayButton = ({ isPlaying, onClick }) => {
  const handleMouseOver = (e) => {
    if (!isPlaying) {
      e.currentTarget.style.backgroundColor = '#ffffff';
      e.currentTarget.style.color = '#000000';
    }
  };

  const handleMouseOut = (e) => {
    if (!isPlaying) {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#ffffff';
    }
  };

  return (
    <button
      onClick={onClick}
      style={styles.playButton(isPlaying)}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      aria-label={isPlaying ? 'Pause radio' : 'Play radio'}
    >
      {isPlaying ? '⏸ PLAYING' : '▶ LISTEN'}
    </button>
  );
};

export const NowPlaying = ({ track }) => (
  <div style={styles.nowPlaying}>
    <div style={styles.trackTitle}>
      {track.title}
    </div>
    <div style={styles.artistName}>
      {track.artist}
    </div>
  </div>
);

export const GenreNote = () => (
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
    </div>
  </div>
);