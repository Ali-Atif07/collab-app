import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Toaster } from 'react-hot-toast';
import DocumentEditor from './components/DocumentEditor/DocumentEditor';
import JoinRoom from './components/Room/JoinRoom';
import { useAuth } from './hooks/useAuth';
import { useRoom } from './hooks/useRoom';
import './App.css';

function App() {
  const { userId, userName, saveUserData, clearUserData } = useAuth();
  const { roomId, joinRoom, leaveRoom } = useRoom();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleJoinRoom = useCallback((name, room) => {
    saveUserData(name);
    joinRoom(room);
  }, [saveUserData, joinRoom]);

  const handleLeaveRoom = useCallback(() => {
    leaveRoom();
    clearUserData();
  }, [leaveRoom, clearUserData]);

  return (
    <div className={`app-container ${isLoaded ? 'loaded' : ''}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: 'white',
            borderRadius: '16px',
            fontWeight: '500',
          },
        }}
      />
      
      <div className="floating-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`particle particle-${i % 5}`} />
        ))}
      </div>

      {!roomId ? (
        <JoinRoom onJoin={handleJoinRoom} />
      ) : (
        <DocumentEditor 
          userId={userId}
          userName={userName}
          roomId={roomId}
          onLeave={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;
