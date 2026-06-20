import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

console.log("[Socket.io] Initializing socket connection to:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "http.long-polling"],
});

socket.on("connect", () => {
  console.log("[Socket.io] Connected to server");
});

socket.on("disconnect", (reason) => {
  console.log("[Socket.io] Disconnected from server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("[Socket.io] Connection error:", error);
});

socket.on("error", (error) => {
  console.error("[Socket.io] Socket error:", error);
});
