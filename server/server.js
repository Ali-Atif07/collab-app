import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors());
app.use(express.json());

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.API_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// In-memory storage for documents and rooms
const documents = new Map();
const rooms = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    activeRooms: rooms.size,
    totalDocuments: documents.size
  });
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    
    // Add user to room
    const roomUsers = rooms.get(roomId);
    roomUsers.set(userId, { userId, userName, socketId: socket.id });
    
    // Send existing document to user
    const document = documents.get(roomId) || '';
    socket.emit('load-document', document);
    
    // Broadcast updated user list to all users in room
    const activeUsers = Array.from(roomUsers.values());
    io.to(roomId).emit('active-users', activeUsers);
    
    console.log(`User ${userName} (${userId}) joined room ${roomId}`);
    console.log(`Active users in room ${roomId}:`, activeUsers.length);
  });

  // Handle text changes
  socket.on('send-changes', ({ roomId, delta, userId }) => {
    // Broadcast changes to all other users in the room
    socket.to(roomId).emit('receive-changes', { delta, userId });
  });

  // Handle cursor movement
  socket.on('cursor-move', ({ roomId, userId, userName, position }) => {
    // Broadcast cursor position to all other users in the room
    socket.to(roomId).emit('cursor-position', { userId, userName, position });
  });

  // Save document
  socket.on('save-document', ({ roomId, content }) => {
    documents.set(roomId, content);
    console.log(`Document saved for room ${roomId}`);
  });

  // Handle user leaving room
  socket.on('leave-room', ({ roomId, userId }) => {
    handleUserDisconnect(socket, roomId, userId);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and remove user from all rooms
    rooms.forEach((roomUsers, roomId) => {
      roomUsers.forEach((user, userId) => {
        if (user.socketId === socket.id) {
          handleUserDisconnect(socket, roomId, userId);
        }
      });
    });
  });
});

// Helper function to handle user disconnect
function handleUserDisconnect(socket, roomId, userId) {
  if (!rooms.has(roomId)) return;
  
  const roomUsers = rooms.get(roomId);
  roomUsers.delete(userId);
  
  // Notify other users
  socket.to(roomId).emit('user-disconnected', userId);
  
  // Update active users list
  const activeUsers = Array.from(roomUsers.values());
  io.to(roomId).emit('active-users', activeUsers);
  
  // Clean up empty rooms
  if (roomUsers.size === 0) {
    rooms.delete(roomId);
    // Optionally: Keep document for 24 hours or delete immediately
    // documents.delete(roomId);
    console.log(`Room ${roomId} is now empty`);
  }
  
  socket.leave(roomId);
  console.log(`User ${userId} left room ${roomId}`);
}

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
  🚀 Real-Time Collaboration Server
  ================================
  Server running on port ${PORT}
  WebSocket endpoint: ws://:${process.env.APP_URL + PORT}
  Health check: http://${process.env.APP_URL + PORT}/health
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});