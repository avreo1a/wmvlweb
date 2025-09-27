import { useState, useEffect, useCallback, useRef } from 'react';
import { radioConfig } from '../data/tracks';

const STREAM_URL = 'http://54.82.109.78:8000/stream?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExaWNiVW9nZ1NPaGxCQzRzZAEeBBGb7bboWuhmVUAUax7UxqxDWb78_veR3UVwngFbwW23xzcMvGMV-xcIj0s_aem_51ay4nCl6XotucdCuG3Q7w';

export const useRadioState = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [listeners, setListeners] = useState(127);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.preload = 'none';
    
    const audio = audioRef.current;
    
    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleError = (e) => {
      setLoading(false);
      setError('Stream unavailable');
      console.error('Audio error:', e);
    };
    const handleLoadedData = () => {
      setLoading(false);
      setError(null);
    };
    
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setLoading(true);
        setError(null);
        await audioRef.current.play();
        setIsPlaying(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to play stream');
      setIsPlaying(false);
      console.error('Play error:', err);
    }
  }, [isPlaying]);

  return {
    isPlaying,
    currentTrack,
    listeners,
    loading,
    error,
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