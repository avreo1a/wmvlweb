import React from 'react';
import { styles } from '../styles/radioStyles.jsx';

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.pageContent}>
          <h1 style={styles.pageTitle}>About</h1>
          
          <div style={styles.aboutPageContentCompact}>
            <p style={styles.aboutParagraph}>
              WMVL is a student ran internet radio station at Manhattanville in Purchase, New York. 
              The station began it's life as 88.1 FM. The station played everything from Rap to Pop, 
              Jazz to House, and Country to Rock. The station was well known and even was asked to 
              play the music for American Eagle stores, review concerts, and was #2 in the 2018 
              Princeton Review of Best College Radio Stations. However, WMVL closed its doors in 2020 
              due to the pandemic.
            </p>
            
            <p style={styles.aboutParagraph}>
              But, the station lives on! As of Fall 2023, the station was opened back up providing 
              music, events, and information to the student population of Manhattanville. It looks 
              to the past for inspiration, while pushing what it means to be a college station.
            </p>
            
            <div style={styles.motto}>
              KEEPING THE PULSE ALIVE!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;