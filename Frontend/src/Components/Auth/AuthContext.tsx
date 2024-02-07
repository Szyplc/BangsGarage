import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, convertUrlToFullUrl } from "../../base";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Media, CarData } from "../../types/types";

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
    getCarsId: () => Promise<string[]>;
    getCarData: (car_id: string) => Promise<any>;
    getMediaFullUrl: (car: CarData) => Promise<CarData>
  }
  
  export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: null,
    setIsAuthenticated: () => {},
    user: null,
    setUser: () => {},
    getToken: () => { return new Promise((resolve) => resolve("")) },
    signIn: () => {},
    signOutAuthContext: () => {},
    cars_id: [],
    setCars_id: () => {},
    getCarsId: () => { return new Promise((resolve) => resolve([])) },
    getCarData: () => { return new Promise((resolve) => resolve({})) },
    getMediaFullUrl: () => { return new Promise((resolve) => resolve({} as CarData))}
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

    const getCarsId = async (): Promise<string[]> => {
      try {
          const response = await axios.get("http://127.0.0.1:3000/getUserCars", {
              headers: {
                  "Content-Type": "application/json",
              }
          });
          return response.data;
      } catch (error) {
          console.error("Wystąpił błąd:", error);
          return []; // Zwróć pustą tablicę w przypadku błędu
      }
  };
  

    const getCarData = async (car_id: string) => {
      let currentData: any;
      try {
        currentData = axios.get("http://127.0.0.1:3000/getCarData", {
          headers: {
            "Content-Type": "application/json"
          },
          params: {
            car_id :car_id
          }
        })
        return currentData
      } catch (error) {
        console.error(error)
        return {}
      }
    }

    const getMediaFullUrl = async (car: CarData) => {
      for (const media of car.media) {
        media.fullUrl = await convertUrlToFullUrl(media.url || "");
      }
      const carProfileImage = car.media.find(obj => obj.profile === true)?.url;
      car.profileUrl = await convertUrlToFullUrl(carProfileImage || "");
      return car;
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, getToken, signIn, signOutAuthContext, cars_id, setCars_id, getCarsId, getCarData, getMediaFullUrl }}>
        {children}
      </AuthContext.Provider>
    );
  };