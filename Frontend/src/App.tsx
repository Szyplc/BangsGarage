import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./Components/Slajder/Slajder.css";
import "./App.css"

import Slajder from "./Components/Slajder/Slajder";
import Profile from "./Components/Profile/Profile";
import Menu from "./Components/Menu/Menu";
import Messages from "./Components/Communication/Messages/Messages";
import Requests from "./Components/Communication/Requests/Request";
import Chat from "./Components/Communication/Chat";
import Search from "./Components/Search/Search";
import QuestionForm from "./Components/Profile/QuestionForm/QuestionForm";
import MenuSurveys from "./Components/Profile/QuestionForm/MenuSurveys";
import Register from "./Components/Auth/Register";
import Index from "./Index";
import Configuration from "./Components/Profile/Configuration/Configuration";
import Login from "./Components/Auth/Login";
import CarCreator from "./Components/Car/CarCreator";
import UserCar from "./Components/Car/UserCar";
import CarProfile from "./Components/Car/CarProfile";
import CarGallery from "./Components/CarGallery/CarGallery";
import { User, getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "./base";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./Store/store";
import { getIsAuthenticated, signIn, signOut } from "./Store/authSlice";

export const DoubleClickEvent = createContext<{
  heartColor: string;
  setHeartColor: React.Dispatch<React.SetStateAction<string>>;
}>({
  heartColor: "#ffffff",
  setHeartColor: () => {},
});

const App: React.FC = () => {
  const [heartColor, setHeartColor] = useState("#ffffff");
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
        <DoubleClickEvent.Provider value={{ heartColor, setHeartColor }}>
          <div className="app">
            <div className="content-holder">
              <Routes>
                <Route path="/" element={isAuthenticated ? <Slajder /> : <Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {isAuthenticated && 
                  <>
                    <Route path="/slajder" element={<Slajder />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/surveys" element={<QuestionForm />} />
                    <Route path="/menuSurveys" element={<MenuSurveys />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/configuration" element={<Configuration />} />
                    <Route path="/carConfig" element={<CarCreator />} />
                    <Route path="/likedCars" element={<UserCar type="liked"/>} />
                    <Route path="/carProfile" element={<CarProfile />} />
                    <Route path="/carGallery" element={<CarGallery />} />
                  </>}
                <Route path="*" element={<Index />} />
              </Routes>
            </div>
            <MenuContainer />
            </div>
        </DoubleClickEvent.Provider>
      </Router>
  );
};

const MenuContainer: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isConfigurationPage = 
  location.pathname === "/configuration"
  || location.pathname === "/login"
  || location.pathname === "/register";

  if (isConfigurationPage || !isAuthenticated) {
    return null; // Jeśli jesteśmy na stronie /configuration, zwracamy null, aby ukryć Menu
  }

  return <Menu />;
};

export default App;
