import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../../base";
import axios, { AxiosError } from "axios";

interface AuthContextProps {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (value: boolean | null) => void;
    user: User | null;
    setUser: (value: User | null) => void;
    getToken: (userCredential: User | undefined) => Promise<string | undefined>;
    signIn: (currentUser: User) => void;
    signOutAuthContext: () => void;
    cars_id: string[];
    setCars_id: (value: string[]) => void;
  }
  
  export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: null,
    setIsAuthenticated: () => {},
    user: null,
    setUser: () => {},
    getToken: () => { return new Promise((resolve) => resolve("")) },
    signIn: (currentUser: User) => {},
    signOutAuthContext: () => {},
    cars_id: [],
    setCars_id: () => {}
  });
  
  
  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [cars_id, setCars_id] = useState<string[]>([]);
  
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

    const getCarsId = async () => {
      //uzyc endpointa do ktorego damy useruid i pozbieramy wszystkie cars ktore maja id usera
      axios.put("http://127.0.0.1:3000/updateCarProfileImage", { user: user }, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
    }
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, getToken, signIn, signOutAuthContext, cars_id, setCars_id }}>
        {children}
      </AuthContext.Provider>
    );
  };