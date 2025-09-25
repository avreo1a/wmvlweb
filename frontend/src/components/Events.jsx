import React from 'react';
import { styles } from '../styles/radioStyles.jsx';

const Events = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.pageTitle}>
          EVENTS
        </div>
        <div style={styles.eventsContent}>
          <div style={styles.eventPhoto}>
            <img 
              src="/event-placeholder.jpg" 
              alt="WMVL Event" 
              style={styles.eventImage}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={styles.eventImagePlaceholder}>
            event photo coming soon
            </div>
          </div>
          <div style={styles.eventTextBox}>
            <p>Stay tuned for upcoming WMVL events, live performances, and special broadcasts. We're always working on bringing you unique musical experiences and connecting with our listener community.</p>
            <p>Follow us on social media and check back here for announcements about our next event!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;