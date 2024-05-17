import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#C2BEBE", // gris le plus commun
      light: "#C9C9C9", // gris plus clair
      dark: "#666666", // gris plus foncé
    },
    secondary: {
      main: "#FF544F", // orange foncé
      light: "#FAD126", // orange clair
    },
    common: {
      black: "#000000", // noir sur certains textes
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    fontSize: 14,
  },
  spacing: 8,
});
