import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard'; // Import your Dashboard component
import ThreatMap from './map'; // Assuming ThreatMap is a placeholder
import AdvisoryDetailWrapper from './AdvisoryDetailWrapper'; // Import the AdvisoryDetailWrapper component
import ThreatInsights from './ThreatInsights';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import TrendsPage from './Trends';
import FlatMap from './FlatMap';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Include your Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<ThreatMap />} />
        <Route path="/flatmap" element={<FlatMap />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trends" element={<TrendsPage />} /> {/* Use your TrendsPage component */}
        <Route path="/trends/:advisoryId" element={<AdvisoryDetailWrapper />} />
        <Route path="/insights" element={<BlogList />} />
        <Route path="/insights/:id" element={<BlogDetail />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Catch-all route for unmatched paths */}
      </Routes>
    </Router>
  );
};

export default App;
