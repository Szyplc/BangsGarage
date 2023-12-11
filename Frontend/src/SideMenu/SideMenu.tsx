import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useStyles } from "../style";
import { Link } from 'react-router-dom';
import Heart from "./SideMenuComponents/Heart";
import { useState } from "react";

interface SideMenuProps {
  showProfile?: boolean;
  heartColorProp?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({showProfile = true, heartColorProp = "#ffffff"}) => {
  const classes = useStyles();
  
  const [heartColor, setHeartColor] = useState(heartColorProp);
  
  const handleHeartClick = () => {
    setHeartColor("#ff0000")
  };

  return (
    <div className={classes.iconOverlay_profile}>
      <Link to="/profile" state={{isYourProfile: false}}>
        <FontAwesomeIcon icon={faUser} className={classes.profil} visibility={showProfile ? "visible": "hidden"}/>
      </Link>
      <span onClick={handleHeartClick}><Heart fillColor={heartColorProp == "#ffffff" ? heartColor : heartColorProp }/></span>
    </div>
  );
};

export default SideMenu;
