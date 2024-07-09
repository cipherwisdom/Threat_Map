import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard'; // Import your Dashboard component
import ThreatMap from './map'; // Assuming ThreatMap is a placeholder
// import TrendsPage from './TrendsPage';
import AdvisoryDetailWrapper from './AdvisoryDetailWrapper'; // Import the AdvisoryDetailWrapper component
import ThreatInsights from './ThreatInsights';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import TrendsPage from './Trends';

const App = () => {
  const [blogs] = useState([
    { id: 1, title: 'Understanding IB Attacks and CI Attacks', content: 'In the world of cybersecurity, it is crucial to understand the different types of attacks that can threaten the integrity, confidentiality, and availability of systems. IB attacks, or Integrity Breach attacks, and CI attacks, are two such categories. \n\nIB attacks focus on compromising the integrity of data, making unauthorized changes that can lead to misinformation or data corruption. Examples include data tampering and unauthorized database modifications. \n\nCI attacks, on the other hand, aim to breach the confidentiality of data. These attacks seek to access and expose sensitive information without authorization. Common examples are data breaches and eavesdropping. \n\nBoth types of attacks pose significant risks and require robust security measures to prevent and mitigate their effects.' },
    { id: 2, title: 'Second Blog', content: 'This is the content of the second blog.' },
    // Add more blogs here
  ]);

  return (
    <Router>
      <Navbar /> {/* Include your Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<ThreatMap />} />
        <Route path="/map" element={<ThreatMap />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trends" element={<TrendsPage />} /> {/* Use your TrendsPage component */}
        <Route path="/trends/:advisoryId" element={<AdvisoryDetailWrapper />} />
        <Route path="/insights" element={<BlogList blogs={blogs} />} />
        <Route path="/insights/:id" element={<BlogDetail />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Catch-all route for unmatched paths */}
      </Routes>
    </Router>
  );
};

export default App;
