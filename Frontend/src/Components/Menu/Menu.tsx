import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  return (
    <div className="menu-container">
      <Link to="/messages">Wiadomości</Link>
      <Link to="/slajder">Home</Link>
      <Link to="/search">Lupa</Link>
      <Link to="/profile" state={{isYourProfile: true}}>Profil</Link>
    </div>
  );
};

export default Menu;
