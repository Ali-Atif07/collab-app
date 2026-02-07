import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {

  if (!socket) {
    const url = process.env.VITE_API_URL || 'http://localhost:5000';
    socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};