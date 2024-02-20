import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useStyles } from "../style";
import { Link, useNavigate } from 'react-router-dom';
import Heart from "./SideMenuComponents/Heart";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Car, CarToShowIndex, CarsToShow, LikesToShow, setCarByCar } from "../Store/carSlice";
import { getUser } from "../Store/authSlice";
import axios from "axios";
import { AppDispatch, RootState } from "../Store/store";

const SideMenu = ({ indexMenu, isDoubleClick } : { indexMenu: number, isDoubleClick: boolean }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const user = useSelector(getUser)
  const index = useSelector(CarToShowIndex)
  const carsToShow = useSelector(CarsToShow)
  const likesToShow = useSelector(LikesToShow)
  const [heartColor, setHeartColor] = useState("#ffffff");
  const [increment, setIncrement] = useState<number>(0)
  const dispatch = useDispatch<AppDispatch>()

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
  useEffect(() => {
    if(!likesToShow[indexMenu] && isDoubleClick) {
      handleHeartClick()
    }
  }, [isDoubleClick])

  const handleHeartClick = async () => {
    toggleHeartColor()
    const _id_car = carsToShow[index]._id
    await axios.post("http://127.0.0.1:3000/toggle_like_to_car", { carId: _id_car })
  };

  useEffect(() => {
      if(likesToShow[indexMenu]) 
        setHeartColor("#ff0000")
      else 
        setHeartColor("#ffffff")
  }, [])

  const onProfileClick = () => {
    dispatch(setCarByCar(carsToShow[index]))
    navigate("/carGallery")
  }

  return (
    <div className={classes.iconOverlay_profile}>
      <FontAwesomeIcon icon={faUser} className={classes.profil} visibility={true ? "visible": "hidden"} onClick={onProfileClick}/>
      <div onClick={handleHeartClick}><Heart fillColor={ heartColor }/></div>
      <div style={{ textAlign: "center", color: "white"}}>{ carsToShow?.[index]?.likes_count + increment }</div>
    </div>
  );
};

export default SideMenu;
