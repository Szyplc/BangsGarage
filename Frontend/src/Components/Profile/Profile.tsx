/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../base";
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
  const [photos, setPhotos] = useState([]);
  const url = location.pathname
  const get_photos = async () => {
    axios
      .get("http://127.0.0.1:3000/get_photos_from_gallery", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setPhotos(response.data);
      })
      .catch(() => {
        navigate("/");
      });
  };
  useEffect(() => {
    get_photos();
  }, []);
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

  const handleSwipe = (event: any) => {
    if (event.dir === "Left") {
      navigate(-1);
    }
  };

  const DeletePhoto = (photo: any) => {
    axios
      .post("http://127.0.0.1:3000/delete_photo", photo, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Przetwarzanie odpowiedzi
        const data = response.data;
        // Możesz tu dodać kod do przetwarzania danych z odpowiedzi
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });

    setPhotos(photos.filter((p: any) => p.url != photo.url));
    const imageRef = ref(storage, photo.url);
    deleteObject(imageRef)
      .then(() => {})
      .catch((error: any) => {
        console.error(error);
      });
  };

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
