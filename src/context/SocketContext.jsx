
import React, { createContext, useContext } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../api';

const socket = io(BASE_URL);
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
