import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const STREAM_URL = 'http://54.82.109.78:8000/stream';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    audioRef.current.volume = volume;
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
      setError('Stream unavailable');
    };
    const handlePlaying = () => {
      console.log('Stream is playing');
      setLoading(false);
      setError(null);
    };
    const handleWaiting = () => {
      console.log('Stream buffering...');
    };
    const handleLoadStart = () => {
      console.log('Loading stream...');
      if (!isPlaying) {
        setLoading(true);
      }
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setLoading(true);
        setError(null);
        
        const timeoutId = setTimeout(() => {
          if (loading && !isPlaying) {
            setLoading(false);
            setError('Stream connection timeout');
          }
        }, 5000);
        
        await audioRef.current.play();
        clearTimeout(timeoutId);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError('Cannot connect to stream');
      setIsPlaying(false);
      console.error('Play error:', err.message);
    }
  };

  const value = {
    isPlaying,
    loading,
    error,
    volume,
    togglePlay,
    setVolume
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};