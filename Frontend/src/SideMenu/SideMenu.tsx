import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useStyles } from "../style";
import { Link } from 'react-router-dom';
import Heart from "./SideMenuComponents/Heart";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Car, CarToShowIndex, CarsToShow, LikesToShow } from "../Store/carSlice";
import { getUser } from "../Store/authSlice";
import axios from "axios";
import { AppDispatch, RootState } from "../Store/store";

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
  const likesToShow = useSelector(LikesToShow)
  
  const [heartColor, setHeartColor] = useState(heartColorProp);
  const [increment, setIncrement] = useState<number>(0)

  const toggleHeartColor = () => {
    if(heartColor == "#ff0000") {
      setHeartColor("#ffffff")
      setIncrement(increment => increment - 1)
    }
    else {
      setHeartColor("#ff0000")
      setIncrement(increment => increment + 1)
    }
  }

  const handleHeartClick = async () => {
    toggleHeartColor()
    const _id_car = carsToShow[index]._id
    await axios.post("http://127.0.0.1:3000/toggle_like_to_car", { carId: _id_car })
  };

  useEffect(() => {
      if(likesToShow[index]) 
        setHeartColor("#ff0000")
      else 
        setHeartColor("#ffffff")
  }, [index])

  return (
    <div className={classes.iconOverlay_profile}>
      <Link to="/profile" state={{isYourProfile: false}}>
        <FontAwesomeIcon icon={faUser} className={classes.profil} visibility={showProfile ? "visible": "hidden"}/>
      </Link>
      <div onClick={handleHeartClick}><Heart fillColor={heartColorProp == "#ffffff" ? heartColor : heartColorProp }/></div>
      <div style={{ textAlign: "center", color: "white"}}>{ carsToShow?.[index]?.likes_count + increment }</div>
    </div>
  );
};

export default SideMenu;
