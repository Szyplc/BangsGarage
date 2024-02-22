import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface theme {
  Primary: string,
  Secondary: string,
  Accent: string,
  LightGray: string,
  DarkGray: string,
  White: string,
  Background: string,
  HotGray: string,
  SecondAccent: string
}

interface ThemeState {
  darkTheme: theme;
  lightTheme: theme;
  currentTheme: theme;
}

const initialState: ThemeState = {
  darkTheme: {
    Primary: "#181818",
    Secondary: "#404040", // Zmienione z #8C8C8C dla lepszego kontrastu
    Accent: "#FB1E1E",
    LightGray: "#D9D9D9",
    DarkGray: "#404040",
    White: "#FFFFFF",
    Background: "#181818",
    HotGray: "#9E8E7E",
    SecondAccent: "#F4D35E",
  },
  lightTheme: {
    Primary: "#F5F5F5",
    Secondary: "#D9D9D9",
    Accent: "#FB1E1E",
    LightGray: "#D9D9D9",
    DarkGray: "#404040",
    White: "#FFFFFF",
    Background: "#F5F5F5",
    HotGray: "#9E8E7E",
    SecondAccent: "#F4D35E",
  },
  currentTheme: {
    Primary: "#181818",
    Secondary: "#404040", // Zmienione z #8C8C8C dla lepszego kontrastu
    Accent: "#FB1E1E",
    LightGray: "#D9D9D9",
    DarkGray: "#404040",
    White: "#FFFFFF",
    Background: "#181818",
    HotGray: "#9E8E7E",
    SecondAccent: "#F4D35E",
  }
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Możesz dodać więcej akcji do zarządzania innymi kolorami
  },
});

export const { } = themeSlice.actions;

export const CurrentTheme = ( state: RootState ) => state.theme.currentTheme

export default themeSlice.reducer;
