import React, { useState } from 'react';
import { styles } from '../styles/radioStyles.jsx';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = ['Home', 'About', 'Schedule', 'Events', 'Gallery', 'Join'];

  const handleItemClick = (item) => {
    setCurrentPage(item);
    console.log(`Navigating to ${item}`);
  };

  const getNavLinkStyle = (item) => {
    let style = { ...styles.navLink };
    
    // Special styling for "Join" button
    if (item === 'Join') {
      style = {
        ...style,
        color: '#ff0000',
        border: '1px solid #ff0000',
        fontWeight: 'bold'
      };
      
      // When hovering over Join button
      if (hoveredItem === item) {
        style = {
          ...style,
          color: '#ffffff',
          backgroundColor: '#ff0000'
        };
      }
    } else {
      // Normal styling for other items
      if (currentPage === item) {
        style = { ...style, ...styles.navLinkActive };
      }
      
      if (hoveredItem === item && currentPage !== item) {
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
            <li key={item} style={styles.navItem}>
              <a
                style={getNavLinkStyle(item)}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                aria-label={`Navigate to ${item}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;