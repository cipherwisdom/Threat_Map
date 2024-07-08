// src/BottomWidget.js
import React from 'react';
import './App.css';

const BottomWidget = () => {
  return (
    <div className="bottom-widget-wrapper">
    <h2 className="bottom-widget-heading">TOP attacks</h2>
    <div className="bottom-widget">
      <div className="widget-item">Malware</div>
      <div className="widget-item">DoS Attacks</div>
      <div className="widget-item">IB Attacks</div>
      <div className="widget-item">CI Attacks</div>
      <div className="widget-item">Insider Threats</div>
    </div>
  </div>
  );
};

export default BottomWidget;
