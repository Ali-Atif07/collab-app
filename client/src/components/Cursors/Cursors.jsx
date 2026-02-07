import React from 'react';
import './Cursors.css';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];

function Cursors({ cursors }) {
  const getUserColor = (userId) => {
    const index = userId.charCodeAt(0) % COLORS.length;
    return COLORS[index];
  };

  return (
    <div className="cursors-container">
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="cursor-label"
          style={{
            background: getUserColor(userId),
            top: `${cursor.position * 0.5}px`, // Approximate positioning
            left: '50%'
          }}
        >
          {cursor.userName}
        </div>
      ))}
    </div>
  );
}

export default Cursors;