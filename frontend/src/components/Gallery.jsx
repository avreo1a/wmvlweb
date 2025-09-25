import React from 'react';
import { styles } from '../styles/radioStyles.jsx';

const Gallery = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.pageContent}>
          <h1 style={styles.pageTitle}>Gallery</h1>
          
          <div style={styles.galleryEmptyState}>
            <p style={styles.galleryEmptyText}>
              Gallery coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;