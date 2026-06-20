import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);
    console.log(`[Socket.io] Total connected clients: ${io.engine.clientsCount}`);

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};