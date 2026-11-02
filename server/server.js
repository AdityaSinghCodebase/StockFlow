import express from "express";
import cors from "cors";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
// test route

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "StockFlow API is running",
    environment: env.nodeEnv,
  });
});

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

// server

const startServer = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(
      `Server running on http://localhost:${env.port} (${env.nodeEnv})`,
    );
  });
};

startServer();
