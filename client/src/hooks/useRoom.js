import { useState } from 'react';

export const useRoom = () => {
  const [roomId, setRoomId] = useState(null);

  const joinRoom = (room) => {
    setRoomId(room);
  };

  const leaveRoom = () => {
    setRoomId(null);
  };

  return { roomId, joinRoom, leaveRoom };
};
