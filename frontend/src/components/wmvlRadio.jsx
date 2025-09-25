import React, { useState, useEffect } from 'react';
import { tracks } from '../data/tracks';
import { styles } from '../styles/radioStyles.jsx';
import { 
  useRadioState, 
  useTrackRotation, 
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

  const {
    isPlaying,
    currentTrack,
    listeners,
    togglePlay,
    setCurrentTrack,
    setListeners
  } = useRadioState();

  // Custom hooks for side effects
  useTrackRotation(isPlaying, setCurrentTrack, tracks.length);
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
          <PlayButton isPlaying={isPlaying} onClick={togglePlay} />
          <NowPlaying track={tracks[currentTrack]} />
          <GenreNote />
        </div>

        <Stats listeners={listeners} />
        <Footer />
        </div>
      </div>
  );
};

export default WMVLRadio;