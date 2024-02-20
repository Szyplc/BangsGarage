import { createTheme } from "@mui/material"

const colors = {
    primary: {
      main: "#E10600",
      light: "#BDC3C7",
      dark: "#000000",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#004C8C",
      light: "#56CCF2",
      dark: "#7F8C8D",
      contrastText: "#FFFFFF"
    }
  };

export const createMyTheme = (mode: "light" | "dark") => createTheme({
    palette: {
      mode, // Ustawianie trybu na 'light' lub 'dark'
      ...(mode === 'dark' ? {
        // Używanie kolorów primary dla trybu ciemnego
        primary: colors.primary,
        // Dodatkowe dostosowania dla trybu ciemnego
        background: {
          default: "#121212",
          paper: "#1D1D1D",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
        },
      } : {
        // Używanie kolorów secondary dla trybu jasnego
        primary: colors.secondary, // Tutaj używamy palety secondary jako primary dla trybu jasnego
        // Dodatkowe dostosowania dla trybu jasnego
        background: {
          default: "#f7f7f7",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#000000",
          secondary: "#4F4F4F",
        },
      })
    },
  });