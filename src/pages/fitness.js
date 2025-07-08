import React, { useState, useEffect } from 'react';
import '../styles/fitness.css'; // We'll create this CSS file

const Fitness = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/Users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching user:', error));
  }, []);

  const userName = users.length > 0 ? users[0].name : 'Guest';

  return (
    <div className="fitness-container">
      <div className="fitness-overlay"></div>

      <div className="fitness-content">
        <h1 className="fitness-title">Fitness Recommendations</h1>

    
        <div className="fitness-subtext">
          <p>Here are some recommendations to help you feel your best today</p>
        </div>
      </div>
    </div>
  );
};

export default Fitness;