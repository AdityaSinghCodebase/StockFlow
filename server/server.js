import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

// test route

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "StockFlow API is running",
  });
});

// server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
