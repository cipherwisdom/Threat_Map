import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdvisoryWidget from './AdvisoryWidget';

const TrendsPage = () => {
  const navigate = useNavigate();

  const advisories = [
    { id: 1, name: 'Advisory 1', shortDescription: 'Short description here', fullDescription: 'Full description of Advisory 1' },
    { id: 2, name: 'Advisory 2', shortDescription: 'Short description here', fullDescription: 'Full description of Advisory 2' },
    { id: 3, name: 'Advisory 3', shortDescription: 'Short description here', fullDescription: 'Full description of Advisory 2' },
    { id: 1, name: 'Advisory 1', shortDescription: 'Short description here', fullDescription: 'Full description of Advisory 1' },
    { id: 2, name: 'Advisory 2', shortDescription: 'Short description here', fullDescription: 'Full description of Advisory 2' },
    { id: 3, name: 'Advisory 3', shortDescription: 'Short description here', fullDescription: 'Full description of Advisory 2' },
    { id: 2, name: 'Advisory 2', shortDescription: 'Short description here', fullDescription: 'Full description of Advisory 2' },
    
    // Add more advisory objects as needed
  ];

  const handleSelect = (advisory) => {
    navigate(`/trends/${advisory.id}`, { state: { advisory } });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Advisories</h2>
      <div style={styles.gridContainer}>
        {advisories.map((advisory) => (
          <AdvisoryWidget 
            key={advisory.id} 
            advisory={advisory} 
            onSelect={handleSelect} 
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
  },
  title: {
    fontSize: '44px',
    fontWeight: 'bold',
    color: '#aec3d6', // Set the color to blue
    textAlign: 'center', // Align the text to the middle
    marginTop: '16px', // Add some top margin for spacing
    textDecorationLine: 'underline',
    
  },

  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
};

export default TrendsPage;
