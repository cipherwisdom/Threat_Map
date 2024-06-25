import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard'; // Import your Dashboard component
import ThreatMap from './demo'; // Assuming ThreatMap is a placeholder
import TrendsPage from './TrendsPage';
import AdvisoryDetailWrapper from './AdvisoryDetailWrapper'; // Import the AdvisoryDetailWrapper component
import ThreatInsights from './ThreatInsights';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Include your Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<ThreatMap />} />
        <Route path="/map" element={<ThreatMap />} /> {/* Consider combining these routes if they serve the same purpose */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trends" element={<TrendsPage />} /> {/* Use your TrendsPage component */}
        <Route path="/trends/:advisoryId" element={<AdvisoryDetailWrapper />} />
        <Route path="/insights" element={<ThreatInsights/>} /> {/* Placeholder for future implementation */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Catch-all route for unmatched paths */}
      </Routes>
    </Router>
  );
};

export default App;
