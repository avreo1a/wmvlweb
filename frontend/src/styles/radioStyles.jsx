export const styles = {
  container: {
    fontFamily: "'Courier New', monospace",
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1.4,
    margin: 0,
    padding: '70px 20px 20px 20px',
    boxSizing: 'border-box'
  },

  content: {
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%',
    padding: '40px 20px'
  },

  logo: (isMobile = false) => ({
    fontSize: isMobile ? '2.5em' : '6em',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    marginBottom: '30px',
    color: '#ffffff',
    fontFamily: "'Courier New', monospace",
    userSelect: 'none'
  }),

  tagline: {
    fontSize: '1.2em',
    marginBottom: '50px',
    color: '#cccccc',
    letterSpacing: '0.05em',
    userSelect: 'none'
  },

  liveStatus: {
    margin: '30px 0',
    fontSize: '0.9em',
    color: '#666666',
    userSelect: 'none'
  },

  liveIndicator: {
    color: '#ff0000',
    marginRight: '10px',
    animation: 'blink 1.5s infinite ease-in-out',
    display: 'inline-block',
    fontWeight: 'bold'
  },

  playerContainer: {
    margin: '40px 0',
    padding: '20px',
    border: '1px solid #333333',
    backgroundColor: '#111111',
    borderRadius: '0',
    boxShadow: 'none'
  },

  playButton: (isPlaying = false) => ({
    backgroundColor: isPlaying ? '#ffffff' : 'transparent',
    border: '2px solid #ffffff',
    color: isPlaying ? '#000000' : '#ffffff',
    padding: '15px 30px',
    fontFamily: "'Courier New', monospace",
    fontSize: '1.1em',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.1em',
    borderRadius: '0',
    outline: 'none',
    userSelect: 'none'
  }),

  nowPlaying: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#000000',
    border: '1px solid #222222',
    fontSize: '0.9em',
    textAlign: 'left'
  },

  trackTitle: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#ffffff'
  },

  artistName: {
    color: '#888888',
    fontSize: '0.9em'
  },

  genreNote: {
    margin: '20px 0',
    fontSize: '0.8em',
    color: '#888888',
    fontStyle: 'italic',
    userSelect: 'none'
  },

  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    margin: '30px 0',
    fontSize: '0.9em',
    flexWrap: 'wrap'
  },

  stat: {
    textAlign: 'center',
    minWidth: '80px'
  },

  statNumber: {
    fontSize: '1.4em',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#ffffff'
  },

  statLabel: {
    color: '#888888',
    fontSize: '0.8em',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    userSelect: 'none'
  },

  aboutSection: {
    margin: '50px 0',
    textAlign: 'left',
    fontSize: '0.9em',
    lineHeight: 1.6,
    color: '#cccccc'
  },

  aboutTitle: {
    marginBottom: '15px',
    color: '#ffffff',
    fontSize: '1.1em',
    letterSpacing: '0.05em',
    fontWeight: 'bold'
  },

  aboutParagraph: {
    marginBottom: '15px'
  },

  footer: {
    marginTop: '60px',
    paddingTop: '30px',
    borderTop: '1px solid #333333',
    fontSize: '0.8em',
    color: '#666666'
  },

  contact: {
    margin: '20px 0'
  },

  contactLink: {
    color: '#ffffff',
    textDecoration: 'underline',
    transition: 'color 0.3s ease'
  },

  socialLinks: {
    margin: '15px 0',
    textAlign: 'center'
  },

  instagramLink: {
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center'
  },

  instagramIcon: {
    width: '20px',
    height: '20px',
    filter: 'brightness(0) saturate(100%) invert(100%)',
    transition: 'filter 0.3s ease'
  },

  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    padding: '10px 20px',
    borderBottom: '1px solid #333333',
    backgroundColor: '#000000',
    zIndex: 1000,
    height: '50px'
  },

  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1800px',
    margin: '0 auto',
    height: '100%'
  },

  navBrand: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.1em'
  },

  navList: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '25px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap'
  },

  navItem: {
    fontSize: '0.8em',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  },

  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    transition: 'color 0.3s ease, text-shadow 0.3s ease',
    cursor: 'pointer',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '0'
  },

  navLinkHover: {
    color: '#ff0000',
    textShadow: '0 0 5px #ff0000'
  },

  navLinkActive: {
    color: '#ff0000',
    textShadow: '0 0 8px #ff0000',
    fontWeight: 'bold'
  },

  pageContent: {
    maxWidth: '800px',
    width: '100%',
    textAlign: 'left'
  },

  pageTitle: {
    fontSize: '3em',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '20px',
    letterSpacing: '0.1em',
    textAlign: 'center',
    fontFamily: "'Courier New', monospace"
  },

  aboutPageContent: {
    fontSize: '1.1em',
    lineHeight: 1.8,
    color: '#cccccc'
  },

  aboutPageContentCompact: {
    fontSize: '1.1em',
    lineHeight: 1.6,
    color: '#ffffff',
    marginBottom: '30px'
  },

  aboutParagraph: {
    marginBottom: '20px',
    textAlign: 'justify'
  },

  motto: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#ff0000',
    textAlign: 'center',
    marginTop: '50px',
    marginBottom: '20px',
    letterSpacing: '0.2em',
    fontFamily: "'Courier New', monospace",
    textShadow: '0 0 10px #ff0000',
    animation: 'pulse 2s infinite ease-in-out'
  },
  motto2: {
    fontSize: '2.6em',
    fontWeight: 'bold',
    color: '#ff0000',
    textAlign: 'center',
    marginLeft: '30px',
    marginTop: '-15px',
    marginBottom: '70px',
    letterSpacing: '0.2em',
    fontFamily: "'Courier New', monospace",
    textShadow: '0 0 10px #ff0000',
    animation: 'pulse 2s infinite ease-in-out'
  },
  pictureSection: {
    marginTop: '40px',
    width: '100%'
  },

  pictureSectionTitle: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '30px',
    textAlign: 'center',
    letterSpacing: '0.1em',
    fontFamily: "'Courier New', monospace"
  },

  pictureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },

  picturePlaceholder: {
    width: '100%',
    height: '200px',
    border: '2px dashed #333333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderRadius: '4px',
    transition: 'border-color 0.3s ease'
  },

  placeholderText: {
    color: '#666666',
    fontSize: '0.9em',
    fontFamily: "'Courier New', monospace",
    textAlign: 'center'
  },

  joinPageContent: {
    fontSize: '1.2em',
    lineHeight: 1.8,
    color: '#ffffff',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center'
  },

  joinSection: {
    marginBottom: '50px',
    padding: '30px',
    backgroundColor: '#111111',
    border: '1px solid #333333',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(255, 0, 0, 0.1)'
  },

  joinSectionTitle: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: '20px',
    letterSpacing: '0.15em',
    fontFamily: "'Courier New', monospace",
    textTransform: 'uppercase',
    textAlign: 'center'
  },

  joinParagraph: {
    marginBottom: '20px',
    textAlign: 'center',
    lineHeight: 1.9,
    fontSize: '1.1em'
  },

  emailLink: {
    color: '#ff0000',
    textDecoration: 'underline',
    transition: 'color 0.3s ease, text-shadow 0.3s ease',
    fontWeight: 'bold',
    fontSize: '1.1em',
    letterSpacing: '0.05em'
  },

 
  comingSoon: {
    fontSize: '3em',
    fontWeight: 'bold',
    color: '#ff0000',
    textAlign: 'center',
    marginTop: '1px',
    marginBottom: '20px',
    letterSpacing: '0.15em',
    fontFamily: "'Courier New', monospace",
    textShadow: '0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.3), 0 0 30px rgba(255, 0, 0, 0.2)',
    animation: 'glitch 3s ease-in-out infinite'
  },

  comingSoonSubtext: {
    fontSize: '1.1em',
    color: '#888888',
    textAlign: 'center',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.05em',
    fontStyle: 'italic'
  },


  eventsContent: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px'
  },

  eventPhoto: {
    width: '100%',
    maxWidth: '500px',
    position: 'relative'
  },

  eventImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #333333'
  },

  eventImagePlaceholder: {
    width: '100%',
    height: '300px',
    backgroundColor: '#111111',
    border: '2px solid #333333',
    borderRadius: '8px',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666666',
    fontSize: '1.1em',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.05em'
  },

  eventTextBox: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#333333',
    padding: '25px',
    borderRadius: '8px',
    fontSize: '1em',
    lineHeight: 1.6,
    color: '#ffffff',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.02em'
  }
};


export const mediaQueries = {
  mobile: '@media (max-width: 768px)',
  tablet: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)'
};