import { Link } from "react-router-dom";
import "./Menu.css";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Menu = () => {
  const [value, setValue] = useState(0);
  const color = "#800000";
  return (
    <BottomNavigation sx={{ background: "#240000", width: "100%", justifyContent: "space-evenly" }} showLabels>
      <Link to="/slajder" onClick={() => setValue(0)} >
        <BottomNavigationAction sx={{ color: "white", verticalAlign: "center", height: "100%", backgroundColor: value == 0 ? {color} : "transparent" }} showLabel 
      label="Home" icon={<img src="./../../../assets/SliderCar.png" alt="Home" style={{ width: 24, height: 24 }}/>} /></Link>
      <Link to="/liked_cars" onClick={() => setValue(1)}>
        <BottomNavigationAction sx={{ color: "white", verticalAlign: "center", height: "100%", backgroundColor: value == 1 ? {color} : "transparent"}} showLabel 
      label="Polubione" icon={<FontAwesomeIcon style={{ width: 24, height: 24}} icon={faHeart} />}/></Link>
      <Link to="/profile" onClick={() => setValue(2)}>
        <BottomNavigationAction sx={{ color: "white", verticalAlign: "center", height: "100%", backgroundColor: value == 2 ? {color} : "transparent"}} showLabel label="Profil" 
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
