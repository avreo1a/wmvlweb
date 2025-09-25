import React, { useState } from 'react';
import WmvlRadio from './components/wmvlRadio';
import About from './components/About';
import Join from './components/Join';
import Gallery from './components/Gallery';
import Navbar from './components/Navbar';

function App() {
    const [currentPage, setCurrentPage] = useState('Home');

    const renderPage = () => {
        switch(currentPage) {
            case 'About':
                return <About />;
            case 'Join':
                return <Join />;
            case 'Gallery':
                return <Gallery />;
            case 'Home':
            default:
                return <WmvlRadio />;
        }
    };

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff' }}>
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {renderPage()}
        </div>
    )
}
export default App;