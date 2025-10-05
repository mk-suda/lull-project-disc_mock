import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const baseTheme = createTheme({
  palette: {
    primary: {
      main: "#003366",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00A9E0",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FF7043",
    },
    error: {
      main: "#FF7043",
    },
    background: {
      default: "#F9FAFC",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: [
      "var(--font-roboto)",
      "var(--font-noto-sans-jp)",
      "Roboto",
      "Open Sans",
      "Noto Sans JP",
      "Hiragino Kaku Gothic ProN",
      "Arial",
      "sans-serif",
    ].join(","),
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

const theme = responsiveFontSizes(baseTheme);

export default theme;
