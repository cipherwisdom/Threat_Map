import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdvisoryDetail from './AdvisoryDetail';

const AdvisoryDetailWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const advisory = location.state?.advisory;

  const creator = { name: 'Pawan Ambhore', role: 'Cyber Security Analyst' }; // Example creator object

  return (
    <AdvisoryDetail 
      advisory={advisory} 
      creator={creator} 
      onBack={() => navigate('/trends')} 
    />
  );
};

export default AdvisoryDetailWrapper;
