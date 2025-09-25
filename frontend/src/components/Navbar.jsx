import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '../styles/radioStyles.jsx';

const Navbar = ({ currentPage }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Join', path: '/join' }
  ];

  const handleItemClick = (item) => {
    navigate(item.path);
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
        <div style={styles.navBrand}>
          WMVL
        </div>
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
      </div>
    </nav>
  );
};

export default Navbar;