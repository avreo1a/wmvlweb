import React, { useState, useEffect } from 'react';
import { tracks } from '../data/tracks';
import { styles } from '../styles/radioStyles.jsx';
import { useAudio } from '../contexts/AudioContext';
import { 
  useListenerUpdates, 
  useBackgroundTrackChanges 
} from '../hooks/useRadio';
import { 
  Logo, 
  Tagline, 
  LiveStatus, 
  PlayButton, 
  NowPlaying, 
  GenreNote, 
  Stats, 
  Footer 
} from './UI';

const WMVLRadio = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [listeners, setListeners] = useState(127);

  const { isPlaying, loading, error, togglePlay } = useAudio();

  // Custom hooks for side effects
  useListenerUpdates(setListeners);
  useBackgroundTrackChanges(isPlaying, setCurrentTrack, tracks.length);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
        <div style={styles.content}>
        <Logo isMobile={isMobile} />
        <Tagline />
        <LiveStatus />

        {/* Player Container */}
        <div style={styles.playerContainer}>
          <PlayButton 
            isPlaying={isPlaying} 
            loading={loading}
            error={error}
            onClick={togglePlay} 
          />
          <NowPlaying track={tracks[currentTrack]} />
          <GenreNote />
          {error && (
            <div style={{
              color: '#ff0000',
              fontSize: '0.8em',
              marginTop: '10px',
              textAlign: 'center',
              fontFamily: "'Courier New', monospace"
            }}>
              Stream temporarily unavailable. Please try again later.
            </div>
          )}
        </div>

        <Stats listeners={listeners} />
        <Footer />
        </div>
      </div>
  );
};

export default WMVLRadio;