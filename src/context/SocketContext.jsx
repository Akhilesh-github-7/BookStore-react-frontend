
import React, { createContext, useContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5002');
const SocketContext = createContext(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
