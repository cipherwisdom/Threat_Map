import React from 'react';
import './App.css'; // Import the CSS file

const AdvisoryDetail = ({ advisory, creator, onBack }) => {
  if (!advisory) {
    return null;
  }

  return (
    <div className="adv-detailspage">
      <button onClick={onBack} className="backButton">Back</button>
      {/* <h2 className="advisoryName">{advisory.name}</h2> */}
      <div className="fullDescription" dangerouslySetInnerHTML={{ __html: advisory.fullDescription }} />
      {creator && (
        <div className="creatorDetails">
          Created by: {creator.name} ({creator.role})
        </div>
      )}
    </div>
  );
};

export default AdvisoryDetail;
