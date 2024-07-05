import React from 'react';

const ThreatInsights = () => {
  const styles = {
    container: {
      marginTop: '10px',
      fontFamily: 'Arial, sans-serif',
      margin: '40px'
    },
    heading: {
      color: '#007bff',
      borderBottom: '2px solid #007bff',
      display: 'inline-block',
      marginBottom: '20px'
    },
    threatItem: {
      borderBottom: '1px solid #007bff',
      padding: '10px 0'
    },
    threatName: {
      fontWeight: 'bold',
      fontSize: '18px'
    },
    description: {
      color: '#666',
      margin: '5px 0'
    },
    date: {
      color: '#007bff',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>THREAT INSIGHTS</h2>
      <div style={styles.threatItem}>
        <div style={styles.threatName}>Threat Name 1</div>
        <div style={styles.description}>Description</div>
        <div style={styles.date}>Date</div>
      </div>
      <div style={styles.threatItem}>
        <div style={styles.threatName}>Threat Name 2</div>
        <div style={styles.description}>Description</div>
        <div style={styles.date}>Date</div>
      </div>
    </div>
  );
};

export default ThreatInsights;
