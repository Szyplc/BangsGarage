import { Link } from "react-router-dom";
import "./Menu.css";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

const Menu = () => {
  return (
    <BottomNavigation>
      <Link to="/messages"><BottomNavigationAction showLabel label="Wiadomości" /></Link>
      <Link to="/slajder"><BottomNavigationAction showLabel label="Home" /></Link>
      <Link to="/search"><BottomNavigationAction showLabel label="Lupa" /></Link>
      <Link to="/profile"><BottomNavigationAction showLabel label="Profil" /></Link>
    </BottomNavigation>
    // <div className="menu-container">
    //   <Link to="/messages">Wiadomości</Link>
    //   <Link to="/slajder">Home</Link>
    //   <Link to="/search">Lupa</Link>
    //   <Link to="/profile" state={{isYourProfile: true}}>Profil</Link>
    // </div>
  );
};

export default Menu;
