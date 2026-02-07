import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import './JoinRoom.css';

const JoinRoom = ({ onJoin }) => {
  const [formData, setFormData] = useState({
    name: '',
    roomId: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const createNewRoom = useCallback(async () => {
    setIsGenerating(true);
    try {
      const newRoomId = uuidv4().substring(0, 8).toUpperCase();
      setFormData(prev => ({ ...prev, roomId: newRoomId }));
      toast.success('New room created! Share this ID with collaborators.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { name, roomId } = formData;

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!roomId.trim()) {
      toast.error('Please enter or generate a room ID');
      return;
    }

    setIsJoining(true);
    try {
      onJoin(name.trim(), roomId.trim().toUpperCase());
      toast.success('Joined room successfully!');
    } catch (error) {
      toast.error('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  }, [formData, onJoin]);

  return (
    <div className="join-room">
      <div className="join-room-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="join-room-card">
        <div className="card-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect width="44" height="44" rx="14" fill="url(#gradient1)"/>
                <path d="M14 16h18M14 22h18M14 28h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="44" y2="44">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>CollabSpace</h1>
          </div>
          <p className="subtitle">Real-time collaborative document editing</p>
        </div>
        
        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label htmlFor="name">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 9a4 4 0 100-8 4 4 0 000 8zM9 11c-3.3 0-6 1.8-6 4v1h12v-1c0-2.2-2.7-4-6-4z" fill="currentColor"/>
              </svg>
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
              autoFocus
              className="input-field"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomId">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13 8V6a4 4 0 00-8 0v2M6 8h6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Room ID
            </label>
            <div className="room-input-group">
              <input
                id="roomId"
                name="roomId"
                type="text"
                placeholder="Enter room ID"
                value={formData.roomId}
                onChange={handleInputChange}
                required
                className="input-field"
                maxLength={20}
                style={{ textTransform: 'uppercase' }}
              />
              <button 
                type="button" 
                className="btn-generate"
                onClick={createNewRoom}
                disabled={isGenerating}
                title="Generate new room ID"
              >
                {isGenerating ? (
                  <svg className="spinner" width="18" height="18" viewBox="0 0 18 18">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="1" strokeDasharray="25 25"/>
                  </svg>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M14 7l-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Generate
                  </>
                )}
              </button>
            </div>
            <small className="helper-text">Share this ID with collaborators to join the same workspace</small>
          </div>

          <button 
            type="submit" 
            className="btn-join"
            disabled={isJoining || !formData.name.trim() || !formData.roomId.trim()}
          >
            {isJoining ? (
              <>
                <svg className="spinner" width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" pathLength="1" strokeDasharray="28 28"/>
                </svg>
                Joining...
              </>
            ) : (
              <>
                <span>Join Workspace</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 14l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M11 7v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span>Real-time sync</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="14" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M10 10l2 2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <span>Multi-user</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 11l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <span>Auto-save</span>
          </div>
        </div>

        <div className="card-footer">
          <p>Powered by WebSocket • Secure & Private</p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
