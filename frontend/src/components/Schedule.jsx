import React from 'react';
import { styles } from '../styles/radioStyles.jsx';

const Schedule = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.pageTitle}>
          SCHEDULE
        </div>
        <div style={styles.comingSoon}>
          COMING SOON
        </div>
        <div style={styles.comingSoonSubtext}>
          we're working on our programming schedule
        </div>
      </div>
    </div>
  );
};

export default Schedule;