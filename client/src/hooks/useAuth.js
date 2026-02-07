import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useAuth = () => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newId = uuidv4();
      setUserId(newId);
      localStorage.setItem('userId', newId);
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const saveUserData = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  const clearUserData = () => {
    setUserName('');
    localStorage.removeItem('userName');
  };

  return { userId, userName, saveUserData, clearUserData };
};
