import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./Components/Slajder/Slajder.css";
import "./App.css"

import Slajder from "./Components/Slajder/Slajder";
import Profile from "./Components/Profile/Profile";
import Menu from "./Components/Menu/Menu";
import Configuration from "./Components/Profile/Configuration/Configuration";
import CarCreator from "./Components/Car/CarCreator";
import UserCar from "./Components/Car/CarCollection";
import CarGallery from "./Components/Car/CarGallery";
import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "./base";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./Store/store";
import { getIsAuthenticated, signIn, signOut } from "./Store/authSlice";
import Auth from "./Components/Auth/Auth";

const App: React.FC = () => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>()
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
              dispatch(signIn(currentUser))
            } else {
              dispatch(signOut())
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          dispatch(signOut())
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

  return (
      <Router>
          <div className="app">
            <div className="content-holder">
              <Routes>
                <Route path="/" element={isAuthenticated ? <Slajder /> : <Auth />} />
                {isAuthenticated && 
                  <>
                    <Route path="/slajder" element={<Slajder />} />
                    <Route path="/liked_cars" element={<Profile />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/configuration" element={<Configuration />} />
                    <Route path="/carConfig" element={<CarCreator />} />
                    <Route path="/likedCars" element={<UserCar type="liked"/>} />
                    <Route path="/carGallery" element={<CarGallery />} />
                    <Route path="/auth" element={<Auth />} />
                  </>}
                <Route path="*" element={<Auth />} />
              </Routes>
            </div>
            <MenuContainer />
            </div>
      </Router>
  );
};

const MenuContainer: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isConfigurationPage = 
  location.pathname === "/configuration"
  || location.pathname === "/login"
  || location.pathname === "/register" || location.pathname === '/auth';

  if (isConfigurationPage || !isAuthenticated) {
    return null; // Jeśli jesteśmy na stronie /configuration, zwracamy null, aby ukryć Menu
  }

  return <Menu />;
};

export default App;
