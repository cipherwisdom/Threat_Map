import React from 'react';


const AdvisoryDetail = ({ advisory, creator, onBack }) => {
  if (!advisory) {
    return null;
  }

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>Back</button>
      <h2 style={styles.advisoryName}>{advisory.name}</h2>
      <p style={styles.fullDescription}>{advisory.fullDescription}</p>
      {creator && (
        <>
          <div>Created by: {creator.name} ({creator.role})</div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '60px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginBottom: '16px',
  },
  advisoryName: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  fullDescription: {
    fontSize: '16px',
    marginTop: '8px',
  },
};

export default AdvisoryDetail;
