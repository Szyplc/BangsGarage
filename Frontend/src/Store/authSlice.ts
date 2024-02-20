import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from '../base'; // Adjust the import path as needed
import { RootState } from './store';
import { setInitialValue } from './carSlice';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | undefined;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: undefined,
};

// Assuming signInWithEmailAndPassword and signOut are implemented elsewhere or using Firebase Auth
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (currentUser: User) => {
    const token = await currentUser.getIdToken();
    setIsAuthenticated(true)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return { user: currentUser, token: token };
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_) => {
    await firebaseSignOut(auth); // Using Firebase signOut
    setIsAuthenticated(false)
    setInitialValue()
    delete axios.defaults.headers.common['Authorization'];
  }
);

export const getToken = createAsyncThunk(
  'auth/getToken',
  async (user: User | null) => {
    if (!user) throw new Error('No user logged in');
    const token = await user.getIdToken();
    return token;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = undefined;
    });
    builder.addCase(getToken.fulfilled, (state, action) => {
      state.token = action.payload;
    });
  },
});

export const getIsAuthenticated = ( state: RootState ) => state.auth.isAuthenticated;
export const getUser = ( state: RootState ) => state.auth.user;

export const { setIsAuthenticated, setUser } = authSlice.actions;

export default authSlice.reducer;