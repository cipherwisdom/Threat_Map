import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import './App.css';
import advisoriesData from './advisories.json';

const AdvisoryWidget = ({ advisory, onSelect }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const widgetStyle = {
    width: isMobile ? '100%' : '380px',
    justifySelf: 'center',
  };

  if (!advisory) {
    return null;
  }

  return (
    <div className="advisoryWidget" style={widgetStyle} onClick={() => onSelect(advisory)}>
      <div className="advisoryName">{advisory.name}</div>
      <div className="advisory-short-description">{advisory.shortDescription}</div>
    </div>
  );
};

const AdvisoryDetail = ({ advisory, creator, onBack }) => {
  if (!advisory) {
    return <div>No advisory selected</div>;
  }

  return (
    <div className="advisory-detail">
      <button onClick={onBack}>Back</button>
      <h2>{advisory.name}</h2>
      <p>{advisory.fullDescription}</p>
      <div className="creator-info">
        <p>{creator.name}</p>
        <p>{creator.role}</p>
      </div>
    </div>
  );
};

const TrendsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [advisories, setAdvisories] = useState([]);
  const advisory = location.state?.advisory;

  useEffect(() => {
    setAdvisories(advisoriesData);
  }, []);

  const handleSelect = (advisory) => {
    navigate(`/trends/${advisory.id}`, { state: { advisory } });
  };

  const handleBack = () => {
    navigate('/trends');
  };

  if (advisory) {
    const creator = { name: 'Pawan Ambhore', role: 'Cyber Security Analyst' };
    return <AdvisoryDetail advisory={advisory} creator={creator} onBack={handleBack} />;
  }

  return (
    <div className="trends-page">
      <h2 className="page-title">ADVISORIES</h2>
      <div className="grid-container">
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

export default TrendsPage;
