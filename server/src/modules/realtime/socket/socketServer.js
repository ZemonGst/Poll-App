import { Server }
  from "socket.io";

import {
  registerSocketEvents,
} from "./socketEvents.js";

let io = null;

export const initializeSocketServer =
  (httpServer) => {

    io = new Server(httpServer, {

      cors: {
        origin: "*",
      },
    });

    io.on(
      "connection",
      (socket) => {

        registerSocketEvents(
          io,
          socket
        );
      }
    );

    console.log(
      "Socket.IO initialized"
    );

    return io;
  };

export const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.IO not initialized"
    );
  }

  return io;
};