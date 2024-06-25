import React from 'react';
import { useMediaQuery } from 'react-responsive';

const AdvisoryWidget = ({ advisory, onSelect }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const widgetStyle = {
    ...styles.widget,
    width: isMobile ? '100%' : '380px', // Adjust width for mobile
    justifySelf: 'center', // Center the widget horizontally
  };

  if (!advisory) {
    return null;
  }

  return (
    <div style={widgetStyle} onClick={() => onSelect(advisory)}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={styles.advisoryName}>{advisory.name}</div>
        <div style={styles.shortDescription}>{advisory.shortDescription}</div>
      </div>
    </div>
  );
};

const styles = {
  widget: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Three columns for the 3x3 grid
    gap: '16px', // Adjust spacing between widgets
    height: '250px',
    padding: '20px',
    backgroundColor: '#aec3d6',
    borderRadius: '15px',
    cursor: 'pointer',
    margin: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    color: '#fff',
    justifyItems: 'start', 
    justifyItems: 'start',// Align widgets to the left (corrected property name)
  },
  advisoryName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
};

export default AdvisoryWidget;
