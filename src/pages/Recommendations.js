import React, { useState, useEffect } from 'react';
import '../styles/Recommendations.css'; // make sure you create this CSS file

const BACKEND_URL = window.__CONFIG__.backendUrl;

const Recommendations = ({ selectedCategory }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
   fetch(`${BACKEND_URL}/workouts`)
      .then((response) => response.json())
      .then((data) => setRecommendations(data))
      .catch((error) => console.error('Error fetching workouts:', error));
  }, []);

  const filteredRecommendations = recommendations.filter(item => {
    if (!selectedCategory) return true; 
    return item.categoryId === selectedCategory;
  });

  return (
    <div className="recommendations-container">
      <div className="recommendations-wrapper">
        <div className="recommendations-grid">
          {filteredRecommendations.map((item) => (
            <div key={item.id} className="recommendation-card">
              <div className="recommendation-image-container">
                <img src={item.thumbnail} alt={item.title} className="recommendation-image" />
                <div className="recommendation-overlay"></div>
                <div className="recommendation-content">
                  <h3 className="recommendation-title">{item.title}</h3>
                  <p className="recommendation-info">{item.duration} • {item.difficulty}</p>
                  <div className="recommendation-button-wrapper">
                    <a 
                      href={item.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="recommendation-button"
                    >
                      Watch
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredRecommendations.length === 0 && (
            <p className="no-workouts-message">No workouts found for this category</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;