import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../../base";
import axios from "axios";

interface AuthContextProps {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (value: boolean | null) => void;
    user: User | null;
    setUser: (value: User | null) => void;
    getToken: (userCredential: User | undefined) => Promise<string | undefined>;
    signIn: (currentUser: User) => void;
    signOutAuthContext: () => void;
  }
  
  export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: null,
    setIsAuthenticated: () => {},
    user: null,
    setUser: () => {},
    getToken: () => { return new Promise((resolve) => resolve("")) },
    signIn: (currentUser: User) => {},
    signOutAuthContext: () => {}
  });
  
  
  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      let unsubscribe: (() => void) | undefined;
    
      const asyncFunction = async () => {
        unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
          if (currentUser) {
            try {
              const tokenResult = await getIdTokenResult(currentUser, true);
              const expirationTime = tokenResult.expirationTime; // Jest to obiekt Date
              const expirationDate = new Date(expirationTime);
    
              if (expirationDate.getTime() > new Date().getTime()) {
                signIn(currentUser)
              } else {
                signOutAuthContext()
              }
            } catch (error) {
              console.error(error);
            }
          } else {
            signOutAuthContext()
          }
        });
      };
    
      asyncFunction();
    
      // Funkcja czyszcząca
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }, []);


    const getToken = async (userCredential: User | undefined) => {
      if(userCredential)
        return await userCredential.getIdToken();
      else
        return await user?.getIdToken() || "";
    }

    const signIn = async (currentUser: User) => {
      setIsAuthenticated(true);
      setUser(currentUser);
      const token = await getToken(currentUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const signOutAuthContext = async () => {
      setIsAuthenticated(false);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, getToken, signIn, signOutAuthContext }}>
        {children}
      </AuthContext.Provider>
    );
  };