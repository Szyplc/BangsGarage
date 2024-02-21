import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import carReducer from './carSlice';
import themeReducer from "./themeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    car: carReducer,
    theme: themeReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
