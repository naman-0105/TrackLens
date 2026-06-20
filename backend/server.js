import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = http.createServer(app);

  initializeSocket(server);

  server.listen(PORT, () => {
    console.log(
      `User Analytics API listening on port ${PORT}`
    );
  });

  process.on("unhandledRejection", (reason) => {
    console.error(reason);

    server.close(() => process.exit(1));
  });
};

start();