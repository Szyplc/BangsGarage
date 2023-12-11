import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./Components/Slajder/Slajder.css";
import "swiper/swiper-bundle.min.css";

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
import { AuthContext } from "./Components/Auth/AuthContext";

export const DoubleClickEvent = createContext<{
  heartColor: string;
  setHeartColor: React.Dispatch<React.SetStateAction<string>>;
}>({
  heartColor: "#ffffff",
  setHeartColor: () => {},
});

const App: React.FC = () => {
  const [heartColor, setHeartColor] = useState("#ffffff");
  const { isAuthenticated } = useContext(AuthContext);

  return (
      <Router>
        <DoubleClickEvent.Provider value={{ heartColor, setHeartColor }}>
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
                </>}
              <Route path="*" element={<Index />} />
            </Routes>
            <MenuContainer />
        </DoubleClickEvent.Provider>
      </Router>
  );
};

const MenuContainer: React.FC = () => {
  const location = useLocation();
  const isConfigurationPage = location.pathname === "/configuration";

  if (isConfigurationPage) {
    return null; // Jeśli jesteśmy na stronie /configuration, zwracamy null, aby ukryć Menu
  }

  return <Menu />;
};

export default App;
