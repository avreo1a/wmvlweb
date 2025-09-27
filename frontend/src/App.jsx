import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import WmvlRadio from './components/wmvlRadio';
import About from './components/About';
import Join from './components/Join';
import Gallery from './components/Gallery';
import Navbar from './components/Navbar';
import Schedule from './components/Schedule';
import Events from './components/Events';
import Admin from './components/Admin';
import MiniPlayer from './components/MiniPlayer';
import { AudioProvider } from './contexts/AudioContext';

function App() {
    const location = useLocation();
    
    //Convert route path to page name for navbar
    const getCurrentPage = () => {
        const path = location.pathname;
        if (path === '/') return 'Home';
        return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
    };

    return (
        <AudioProvider>
            <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff' }}>
                <Navbar currentPage={getCurrentPage()} />
                <Routes>
                    <Route path="/" element={<WmvlRadio />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
                <MiniPlayer />
            </div>
        </AudioProvider>
    )
}
export default App;