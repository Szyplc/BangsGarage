import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import carReducer from './carSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    car: carReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;