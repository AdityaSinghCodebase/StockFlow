import { Box, Typography, Button, Alert } from "@mui/material";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await api.get("/health");
        setMessage(response.data.message);
      } catch (err) {
        setError("Cannot reach the server");
      }
    };

    checkServer();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        StockFlow
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}

export default App;
