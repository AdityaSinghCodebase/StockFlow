import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5B3FD9", // the purple used in the wireframe
    },
    secondary: {
      main: "#8B5CF6",
    },
    background: {
      default: "#F5F6FA", // light grey page background
      paper: "#FFFFFF", // cards, tables
    },
    success: { main: "#22A06B" },
    warning: { main: "#F59E0B" },
    error: { main: "#E5484D" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none", // MUI makes buttons ALL CAPS by default; we don't want that
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10, // rounded corners like the wireframe cards
  },
});

export default theme;
