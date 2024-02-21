import { Link } from "react-router-dom";
import "./Menu.css";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CurrentTheme } from "../../Store/themeSlice";

const Menu = () => {
  const [value, setValue] = useState(0);
  const currentTheme = useSelector(CurrentTheme)
  return (
    <BottomNavigation sx={{ background: currentTheme.Primary, borderTop: `2px solid ${currentTheme.White}`, width: "100%", justifyContent: "space-evenly" }} showLabels>
      <Link to="/slajder" onClick={() => setValue(0)} >
        <BottomNavigationAction sx={{ color: currentTheme.White, verticalAlign: "center", height: "100%", 
        backgroundColor: value == 0 ? { color: currentTheme.Accent } : "transparent" }} showLabel 
      label="Home" icon={<img src="./../../../assets/SliderCar.png" alt="Home" style={{ width: 24, height: 24 }}/>} /></Link>
      <Link to="/liked_cars" onClick={() => setValue(1)}>
        <BottomNavigationAction sx={{ color: currentTheme.White, verticalAlign: "center", height: "100%", 
        backgroundColor: value == 1 ? { color: currentTheme.Accent } : "transparent"}} showLabel 
      label="Polubione" icon={<FontAwesomeIcon style={{ width: 24, height: 24}} icon={faHeart} />}/></Link>
      <Link to="/profile" onClick={() => setValue(2)}>
        <BottomNavigationAction sx={{ color: currentTheme.White, verticalAlign: "center", height: "100%", 
        backgroundColor: value == 2 ? { color: currentTheme.Accent } : "transparent"}} showLabel label="Profil" 
      icon={<FontAwesomeIcon icon={faUser} style={{ width: 24, height: 24 }} />}/></Link>
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
