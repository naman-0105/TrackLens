import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";


import eventRoutes from "./routes/eventRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import heatmapRoutes from "./routes/heatmapRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        configuredOrigins.length === 0 ||
        configuredOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin "${origin}" is not allowed by CORS policy`),
      );
    },

    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests, please try again shortly.",
  },
});

app.use("/api", apiLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "OK",
    uptime: process.uptime(),
  });
});

app.use(
  "/screenshots",
  express.static(
    path.join(__dirname, "public", "screenshots")
  )
);

app.use("/api/events", eventRoutes);

app.use("/api/sessions", sessionRoutes);

app.use("/api/heatmap", heatmapRoutes);

app.use("/api/pages", pageRoutes);

app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
