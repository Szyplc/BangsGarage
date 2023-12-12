/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Profile.css";
import Gallery from "./Gallery/Gallery";
import SideMenu from "../../SideMenu/SideMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DoubleClickEvent } from "../../App";
import AddPhotoToProfileGallery from "./AddPhotoToGallery/AddPhotoToProfileGallery";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../base";
import axios from "axios";

const Profile = () => {
  const location = useLocation();
  const isYourProfile = location.state?.isYourProfile;
  const [photos, setPhotos] = useState([]);
  const get_photos = async () => {
    //   await fetch("http://127.0.0.1:3000/get_photos_from_gallery", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "authorization": JSON.stringify(user),
    //         }
    //     })
    //     .then((res) => {
    //       if(!res.ok) {
    //         throw new Error("Błąd uwierzytelniania")
    //       }
    //       return res.json()
    //     }
    //     )
    //     .then((res) => {
    //       setPhotos(res);
    //     })
    //     .catch(() => {
    //       navigate("/")
    //     })
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
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  const { heartColor, setHeartColor } = useContext(DoubleClickEvent);
  const handleChangeColor = () => {
    setHeartColor("#ff0000");
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/get_profile_config", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        setGender(data.gender ? data.gender : data.genderDictionary.MALE);
        var result = data.genderDictionary[data.gender]
        setGender(result);
        setDescription(data.description);
        setAge(data.age);
        setImageUrl(data.url);
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });
  }, []);

  const handleSwipe = (event: any) => {
    if (event.dir === "Left") {
      navigate(-1);
    }
  };

  const DeletePhoto = (photo: any) => {
    //usuwanie w mongodb
    // fetch("http://127.0.0.1:3000/delete_photo", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(photo)
    // })
    // .then((response) => response.json())
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
      <div
        className="profile-image-wrapper"
        onClick={() => {
          navigate("/configuration");
        }}
      >
        <img className="profile-image" src={imageUrl} alt="Profile" />
      </div>
      <div className="profile-description">
        <p className="profile-description-text">
          {(age ? "Wiek: " + age : "") +
            " Płeć: " +
            gender +
            ". Opis: " +
            description}
        </p>
      </div>
      <Link to="/menuSurveys">
        <button className="survey-button">Ankiety</button>
      </Link>
      {isYourProfile == false ? (
        <SideMenu showProfile={false} heartColorProp={heartColor} />
      ) : (
        <></>
      )}
      <AddPhotoToProfileGallery
        getPhotos={get_photos}
        setPhotos={setPhotos}
        photos={photos}
      ></AddPhotoToProfileGallery>
      <Gallery photos={photos} DeletePhoto={DeletePhoto} />
    </div>
  );
};

export default Profile;
