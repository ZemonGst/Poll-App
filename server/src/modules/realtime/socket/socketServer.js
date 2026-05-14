import { Server }
from "socket.io";

import {
registerSocketEvents,
} from "./socketEvents.js";

let io = null;

const allowedOrigins = [
"http://localhost:5173",
"https://pollsync-vert.vercel.app",
];

const isVercelPreview =
(origin) => {


return (
  typeof origin === "string" &&
  origin.includes(
    "zemongsts-projects.vercel.app"
  )
);

};

export const initializeSocketServer =
(httpServer) => {


io = new Server(httpServer, {

  cors: {

    origin: (
      origin,
      callback
    ) => {

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        isVercelPreview(origin)
      ) {

        callback(null, true);

      } else {

        callback(
          new Error(
            "Not allowed by CORS"
          )
        );
      }
    },

    methods: [
      "GET",
      "POST",
    ],

    credentials: true,
  },
});

io.on(
  "connection",
  (socket) => {

    console.log(
      `Socket connected: ${socket.id}`
    );

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
