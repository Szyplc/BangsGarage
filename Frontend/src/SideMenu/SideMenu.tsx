import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useStyles } from "../style";
import { Link } from 'react-router-dom';
import Heart from "./SideMenuComponents/Heart";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Car, CarToShowIndex, CarsToShow } from "../Store/carSlice";
import { getUser } from "../Store/authSlice";
import axios from "axios";

interface SideMenuProps {
  showProfile?: boolean;
  heartColorProp?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({showProfile = true, heartColorProp = "#ffffff"}) => {
  const classes = useStyles();
  const user = useSelector(getUser)
  const car = useSelector(Car)
  const index = useSelector(CarToShowIndex)
  const carsToShow = useSelector(CarsToShow)
  
  const [heartColor, setHeartColor] = useState(heartColorProp);
  
  const handleHeartClick = async () => {
    setHeartColor("#ff0000")
    const _id_car = carsToShow[index]._id
    //wykonujemy zapytanie z _id_car uid będzie automatycznie dodane w tokenie
    console.log(_id_car)
    await axios.post("http://127.0.0.1:3000/give_like_to_car", { carId: _id_car })
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
