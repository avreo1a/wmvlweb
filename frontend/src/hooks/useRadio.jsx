import { useState, useEffect, useCallback } from 'react';
import { radioConfig } from '../data/tracks';

export const useRadioState = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [listeners, setListeners] = useState(127);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return {
    isPlaying,
    currentTrack,
    listeners,
    togglePlay,
    setCurrentTrack,
    setListeners
  };
};

export const useTrackRotation = (isPlaying, setCurrentTrack, tracksLength) => {
  useEffect(() => {
    if (!isPlaying || tracksLength === 0) return;

    const interval = setInterval(() => {
      setCurrentTrack(prev => (prev + 1) % tracksLength);
    }, radioConfig.trackChangeInterval);

    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTrack, tracksLength]);
};

export const useListenerUpdates = (setListeners) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to update listener count
      if (Math.random() < 0.3) {
        const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
        setListeners(prev => 
          Math.max(
            radioConfig.minListeners, 
            Math.min(radioConfig.maxListeners, prev + change)
          )
        );
      }
    }, radioConfig.listenerUpdateInterval);

    return () => clearInterval(interval);
  }, [setListeners]);
};

export const useBackgroundTrackChanges = (isPlaying, setCurrentTrack, tracksLength) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Only change tracks in background if not actively playing
      // and only 10% chance to simulate live stream continuing
      if (!isPlaying && Math.random() < 0.1 && tracksLength > 0) {
        setCurrentTrack(prev => (prev + 1) % tracksLength);
      }
    }, radioConfig.backgroundTrackInterval);

    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTrack, tracksLength]);
};

// Custom hook for responsive design
export const useResponsiveDesign = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};