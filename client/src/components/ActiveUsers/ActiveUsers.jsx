import React from 'react';
import './ActiveUsers.css';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];

function ActiveUsers({ users, currentUserName }) {
  const getUserColor = (userId) => {
    const index = userId.charCodeAt(0) % COLORS.length;
    return COLORS[index];
  };

  return (
    <div className="active-users">
      <div className="users-list">
        {/* Current user */}
        <div className="user-badge current-user" title={`${currentUserName} (You)`}>
          <span className="user-avatar" style={{ background: '#667eea' }}>
            {currentUserName.charAt(0).toUpperCase()}
          </span>
          <span className="user-name">You</span>
        </div>

        {/* Other users */}
        {users.map((user) => (
          <div 
            key={user.userId} 
            className="user-badge"
            title={user.userName}
          >
            <span 
              className="user-avatar" 
              style={{ background: getUserColor(user.userId) }}
            >
              {user.userName.charAt(0).toUpperCase()}
            </span>
            <span className="user-name">{user.userName}</span>
          </div>
        ))}
      </div>
      
      {users.length > 0 && (
        <div className="users-count">
          {users.length + 1} {users.length === 0 ? 'person' : 'people'} editing
        </div>
      )}
    </div>
  );
}

export default ActiveUsers;