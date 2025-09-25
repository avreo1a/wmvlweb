import React from 'react';
import { styles } from '../styles/radioStyles.jsx';

const Join = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.pageContent}>
          <h1 style={styles.pageTitle}>Join</h1>
          
          <div style={styles.joinPageContent}>
            <div style={styles.joinSection}>
              <h2 style={styles.joinSectionTitle}>Location</h2>
              <p style={styles.joinParagraph}>
                WMVL is located in Berman WMVL lounge 101. Meetings on Wednesdays at 7:15 PM
              </p>
            </div>

            <div style={styles.joinSection}>
              <h2 style={styles.joinSectionTitle}>Involvement</h2>
              <p style={styles.joinParagraph}>
                WMVL is ran by students for students. Come enrich the mville community with your 
                voice and music! Joining WMVL ensures that the diverse and quality programing lives on.
              </p>
              <p style={styles.joinParagraph}>
                If you are interested email{' '}
                <a 
                  href="mailto:wmvlradio@mville.edu" 
                  style={styles.emailLink}
                  aria-label="Email WMVL Radio"
                >
                  wmvlradio@mville.edu
                </a>
                .
              </p>
              <p style={styles.joinParagraph}>
                Any and all skill levels are welcomed!
              </p>
            </div>

            <div style={styles.joinSection}>
              <h2 style={styles.joinSectionTitle}>On Air</h2>
              <p style={styles.joinParagraph}>
                WMVL would be nothing without its talented on-air DJs. If interested, please fill out this application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;