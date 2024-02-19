/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Profile.css";
import Gallery from "./Gallery/Gallery";
import SideMenu from "../../SideMenu/SideMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DoubleClickEvent } from "../../App";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../base";
import axios from "axios";
import UserCar from "../Car/UserCar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { CarsData, getLikedCars, loadCarsData, setCarById } from "../../Store/carSlice";

const Profile = () => {
  const location = useLocation();
  const [photos, setPhotos] = useState([]);
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

  const { heartColor, setHeartColor } = useContext(DoubleClickEvent);
  const handleChangeColor = () => {
    setHeartColor("#ff0000");
  };

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
        setImageUrl(data.url);
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });

      const asyncFunction = async () => {
        dispatch(getLikedCars())
          if(!cars.length)
              dispatch(loadCarsData())
          dispatch(setCarById(""))
      }
      asyncFunction()

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

  const swipeHandlers = useSwipeable({ onSwiped: handleSwipe });
  return (
    <div
      onDoubleClick={handleChangeColor}
      {...swipeHandlers}
      className="profile-container"
    >
      <div>
        <div>
          <div style={{ float: "left" }}
            className="profile-image-wrapper"
            onClick={() => {
              navigate("/configuration");
            }}
          >
            <img className="profile-image" src={imageUrl} alt="Profile" width={100} height={100}/>
          </div>
          <div style={{ float: "right"}} 
                onClick={() => {
                  navigate("/carConfig")
                }}
          >
            Create Car
          </div>
        </div>
        <br></br>
        <div className="profile-description">
          <p className="profile-description-text">
            {username} {(age ? "Wiek: " + age : "") +
              " Płeć: " +
              gender +
              ". Opis: " +
              description}
          </p>
        </div>
      </div>
      <UserCar type="profile" />
    </div>
  );
};

export default Profile;
