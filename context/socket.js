import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const backendUrl = "https://video-conferencing-backend-km4z.onrender.com"; // Backend URL
    const socketConnection = io(backendUrl, {
      transports: ["websocket"], // WebSocket with fallback
    });

    socketConnection.on("connect", () => {
      console.log("Socket connected:", socketConnection.id);
    });

    socketConnection.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(socketConnection);

    // Cleanup on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
