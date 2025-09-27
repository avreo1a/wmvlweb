import { useState, useEffect, useCallback, useRef } from 'react';
import { radioConfig } from '../data/tracks';

const STREAM_URL = 'http://54.82.109.78:8000/stream';

export const useRadioState = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [listeners, setListeners] = useState(127);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata'; // Preload metadata for faster start
    audioRef.current.volume = 0.8;
    // Set stream URL immediately for faster loading
    audioRef.current.src = STREAM_URL;
    
    const audio = audioRef.current;
    
    const handleCanPlay = () => {
      console.log('Stream ready to play');
      setLoading(false);
      setError(null);
    };
    const handleCanPlayThrough = () => {
      console.log('Stream fully buffered');
      setLoading(false);
      setError(null);
    };
    const handleError = (e) => {
      console.error('Audio error:', e, audio.error);
      setLoading(false);
      setError('Stream unavailable - server may be offline');
    };
    const handlePlaying = () => {
      console.log('Stream is playing');
      setLoading(false);
      setError(null);
    };
    const handleWaiting = () => {
      console.log('Stream buffering...');
      // Don't show loading for brief buffering
    };
    const handleLoadStart = () => {
      console.log('Loading stream...');
      // Only show loading on initial load
      if (!isPlaying) {
        setLoading(true);
      }
    };
    
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('loadstart', handleLoadStart);
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('loadstart', handleLoadStart);
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
        setLoading(false);
      } else {
        console.log('Attempting to play stream:', STREAM_URL);
        setLoading(true);
        setError(null);
        
        // Stream URL is already set in useEffect, just play
        const playPromise = audioRef.current.play();
        
        // Shorter timeout since stream is preloaded
        const timeoutId = setTimeout(() => {
          if (loading && !isPlaying) {
            setLoading(false);
            setError('Stream connection timeout');
            console.log('Stream timeout after 5 seconds');
          }
        }, 5000);
        
        await playPromise;
        clearTimeout(timeoutId);
        setIsPlaying(true);
        setLoading(false);
        console.log('Stream started successfully');
      }
    } catch (err) {
      setLoading(false);
      setError('Cannot connect to stream');
      setIsPlaying(false);
      console.error('Play error:', err.message);
    }
  }, [isPlaying, loading]);

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