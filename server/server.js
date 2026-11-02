import express from "express";
import cors from "cors";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(notFound);
app.use(errorHandler);

app.use(express.json());
// test route

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "StockFlow API is running",
    environment: env.nodeEnv,
  });
});

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
