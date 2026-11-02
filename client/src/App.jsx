import { Box, Typography, Button } from "@mui/material";
import WarehouseIcon from "@mui/icons-material/Warehouse";

function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        StockFlow
      </Typography>
      <Button variant="contained" startIcon={<WarehouseIcon />}>
        Add Warehouse
      </Button>
    </Box>
  );
}

export default App;
