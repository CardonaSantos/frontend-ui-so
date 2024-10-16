import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { UserToken } from "../Utils/Types/UserTokenInfo";
import { jwtDecode } from "jwt-decode";

// Creamos el contexto
type SocketContextType = Socket | null;
const SocketContext = createContext<SocketContextType>(null);
// const API_URL = "wss://server-production-nest-production.up.railway.app"; // Asegúrate de que este sea el correcto
// const API_URL = "http://localhost:3000/";
const API_URL = import.meta.env.VITE_API_URL;
// const MIURLSERVER = import.meta.env.VITE_API_URL;

// Hook personalizado para acceder al contexto
export const useSocket = () => {
  return useContext(SocketContext);
};

// Proveedor de contexto que manejará la conexión de Socket.IO
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserToken | null>(null);
  const [socket, setSocket] = useState<SocketContextType>(null);
  const token = localStorage.getItem("authToken");

  console.log("La data del token del user es:", user);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<UserToken>(token);
        setUser(decodedToken); // Guardamos el token decodificado en el estado
        console.log(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      console.log("Intentando conectar con el socket, userId:", user.sub);
      const newSocket = io(`${API_URL}`, {
        query: {
          userId: user.sub, // Asegúrate de que este es el valor correcto
          role: user.rol,
        },
        transports: ["websocket"], // Forzar el uso de WebSocket
      });

      setSocket(newSocket);
      newSocket.on("connect", () => {
        console.log("Socket conectado:", newSocket.id);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Error en la conexión del socket:", error.message);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
