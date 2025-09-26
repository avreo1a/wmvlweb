import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '../styles/radioStyles.jsx';

const Navbar = ({ currentPage }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false); // Close mobile menu on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Join', path: '/join' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleItemClick = (item) => {
    navigate(item.path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
    console.log(`Navigating to ${item.name}`);
  };

  const getNavLinkStyle = (item) => {
    let style = { ...styles.navLink };
    

    if (item.name === 'Join') {
      style = {
        ...style,
        color: '#ff0000',
        border: '1px solid #ff0000',
        fontWeight: 'bold'
      };
      
      //When hovering over Join button
      if (hoveredItem === item.name) {
        style = {
          ...style,
          color: '#ffffff',
          backgroundColor: '#ff0000'
        };
      }
    } else {
      //Normal styling for other items
      if (currentPage === item.name) {
        style = { ...style, ...styles.navLinkActive };
      }
      
      if (hoveredItem === item.name && currentPage !== item.name) {
        style = { ...style, ...styles.navLinkHover };
      }
    }
    
    return style;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div 
          style={{
            ...styles.navBrand,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.target.style.color = '#ff0000';
            e.target.style.textShadow = '0 0 8px #ff0000';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#ffffff';
            e.target.style.textShadow = 'none';
          }}
          aria-label="Go to homepage"
        >
          WMVL
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <ul style={styles.navList}>
            {navItems.map((item) => (
              <li key={item.name} style={styles.navItem}>
                <a
                  style={getNavLinkStyle(item)}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile Hamburger Button */}
        {isMobile && (
          <button
            style={styles.hamburgerButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            onMouseEnter={(e) => {
              e.target.style.color = '#ff0000';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#ffffff';
            }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <ul style={styles.mobileNavList}>
          {navItems.map((item) => (
            <li key={item.name} style={styles.mobileNavItem}>
              <a
                style={item.name === 'Join' ? 
                  { ...styles.mobileNavLink, color: '#ff0000', fontWeight: 'bold' } : 
                  styles.mobileNavLink
                }
                onClick={() => handleItemClick(item)}
                onMouseEnter={(e) => {
                  if (item.name === 'Join') {
                    e.target.style.backgroundColor = '#ff0000';
                    e.target.style.color = '#ffffff';
                  } else {
                    Object.assign(e.target.style, styles.mobileNavLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.name === 'Join') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ff0000';
                  } else {
                    Object.assign(e.target.style, styles.mobileNavLink);
                  }
                }}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;