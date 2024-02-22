/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCar from "../Car/UserCar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { CarsData, getLikedCars, loadCarsData, setCarById } from "../../Store/carSlice";
import { CurrentTheme } from "../../Store/themeSlice";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Profile = () => {
  const location = useLocation();
  const currentTheme = useSelector(CurrentTheme)
  const url = location.pathname
  const [username, setUsername] = useState("")
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const dispatch = useDispatch<AppDispatch>()
  const cars = useSelector(CarsData)
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/user", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response: any) => {
        const data = response.data;
        setUsername(data.username)
        setGender(data.gender ? data.gender : data.genderDictionary.MALE);
        setDescription(data.description);
        setAge(data.age);
        setImageUrl(data.url ?? "https://firebasestorage.googleapis.com/v0/b/bangsgarage.appspot.com/o/config%2Fdefault_profile_image.png?alt=media&token=48953722-672d-4f36-9571-75a0c418059b");
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });
      
      dispatch(getLikedCars())
      if(!cars.length)
          dispatch(loadCarsData())
      dispatch(setCarById(""))

  }, []);

  return (
    <div style={{ height: "100%"}}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: currentTheme.Background, borderBottom: "2px solid white"}}>
          <div
            onClick={() => {
              navigate("/configuration");
            }}
          >
            <img className="profile-image" src={imageUrl} alt="Profile" 
            style={{ margin: "4px", width: 100, height: 100, borderRadius: "50%", border: `2px solid ${currentTheme.DarkGray}` }}/>
          </div>
          <div style={{ color: currentTheme.LightGray, alignItems: "center", margin: "10px", overflow: "scroll", textAlign: "center" }}>
            <div>{username}</div>
            <div>{gender} {(age ? "Wiek: " + age : "")} b </div>
            <div>{description && description}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center",flexDirection: "column", justifyContent: "space-evenly", color: currentTheme.LightGray, margin: "5px" }}
                onClick={() => {
                  navigate("/carConfig")
                }}
          >
            <FontAwesomeIcon icon={faCar} style={{ height: "60px", width: "60px", flexDirection: "column", alignItems: "center" }}/>
            Dodaj auto
          </div>
        </div>
      </div>
      <UserCar type={url} />
    </div>
  );
};

export default Profile;
