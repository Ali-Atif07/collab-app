import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getSocket } from '../../services/socket';
import ActiveUsers from '../ActiveUsers/ActiveUsers';
import Cursors from '../Cursors/Cursors';
import './DocumentEditor.css';

const SAVE_INTERVAL = 2000; // Auto-save every 2 seconds

function DocumentEditor({ userId, userName, roomId, onLeave }) {
  const [content, setContent] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const quillRef = useRef(null);
  const socketRef = useRef(null);
  const isRemoteChange = useRef(false);

  // Initialize socket connection
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      
      // Join room
      socket.emit('join-room', {
        roomId,
        userId,
        userName
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Load initial document
    socket.on('load-document', (doc) => {
      if (doc) {
        isRemoteChange.current = true;
        setContent(doc);
      }
    });

    // Receive content changes from other users
    socket.on('receive-changes', ({ delta, userId: senderId }) => {
      if (senderId !== userId && quillRef.current) {
        const editor = quillRef.current.getEditor();
        isRemoteChange.current = true;
        editor.updateContents(delta);
      }
    });

    // Update active users list
    socket.on('active-users', (users) => {
      setActiveUsers(users.filter(u => u.userId !== userId));
    });

    // Receive cursor positions
    socket.on('cursor-position', ({ userId: cursorUserId, position, userName: cursorUserName }) => {
      if (cursorUserId !== userId) {
        setCursors(prev => ({
          ...prev,
          [cursorUserId]: { position, userName: cursorUserName }
        }));
      }
    });

    // Remove cursor when user disconnects
    socket.on('user-disconnected', (disconnectedUserId) => {
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[disconnectedUserId];
        return newCursors;
      });
    });

    return () => {
      socket.emit('leave-room', { roomId, userId });
      socket.off('connect');
      socket.off('disconnect');
      socket.off('load-document');
      socket.off('receive-changes');
      socket.off('active-users');
      socket.off('cursor-position');
      socket.off('user-disconnected');
    };
  }, [roomId, userId, userName]);

  // Handle text changes
  const handleChange = useCallback((content, delta, source, editor) => {
    if (source === 'user' && !isRemoteChange.current) {
      setContent(content);
      
      // Send changes to server
      if (socketRef.current) {
        socketRef.current.emit('send-changes', {
          roomId,
          delta,
          userId
        });
      }
    }
    isRemoteChange.current = false;
  }, [roomId, userId]);

  // Handle cursor position changes
  const handleSelectionChange = useCallback((range, source, editor) => {
    if (range && source === 'user' && socketRef.current) {
      socketRef.current.emit('cursor-move', {
        roomId,
        userId,
        userName,
        position: range.index
      });
    }
  }, [roomId, userId, userName]);

  // Auto-save functionality
  useEffect(() => {
    if (!content || !socketRef.current) return;

    setIsSaving(true);
    const timer = setTimeout(() => {
      socketRef.current.emit('save-document', {
        roomId,
        content
      });
      setIsSaving(false);
    }, SAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [content, roomId]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="document-editor">
      <div className="editor-header">
        <div className="header-left">
          <h2>📄 Document: {roomId}</h2>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            {isSaving && <span className="saving-indicator">💾 Saving...</span>}
          </div>
        </div>
        <div className="header-right">
          <ActiveUsers users={activeUsers} currentUserName={userName} />
          <button className="btn-leave" onClick={onLeave}>
            Leave Room
          </button>
        </div>
      </div>

      <div className="editor-container">
        <div className="editor-wrapper">
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={handleChange}
            onChangeSelection={handleSelectionChange}
            modules={modules}
            theme="snow"
            placeholder="Start typing to collaborate..."
          />
          <Cursors cursors={cursors} />
        </div>
      </div>
    </div>
  );
}

export default DocumentEditor;