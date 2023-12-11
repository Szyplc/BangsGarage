import { signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { auth, storage } from "../../../base";
import "./Configuration.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContext";
import axios from "axios";

function Configuration() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [genderOptions, setGenderOptions] = useState([]);
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [oldImageUrl, setOldImageUrl] = useState<string>("");
  const {
    user,
    signOutAuthContext,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleUpload = async () => {
    let url_photo_image;
    if (profileImage) {
      const storageRef = storage.ref();
      let name = user?.uid + "/profile_image/" + profileImage.name;
      console.log(name);
      console.log(oldImageUrl);
      if (oldImageUrl) {
        const filetoDel = storage.refFromURL(oldImageUrl);
        filetoDel
          .delete()
          .then(() => {})
          .catch((error) => {
            console.error(
              "Wystąpił błąd podczas usuwania pliku z Firebase Storage:",
              error
            );
          });
      }

      const fileRef = storageRef.child(name);
      await fileRef.put(profileImage).then(async () => {
        await fileRef.getDownloadURL().then((url) => {
          url_photo_image = url;
        });
      });
    }

    return url_photo_image;
  };

  useEffect(() => {
    console.log(user);
    // fetch("http://127.0.0.1:3000/get_profile_config", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "authorization": JSON.stringify(user),
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setGenderOptions(data.genderDictionary);
    //     setGender(data.gender ? data.gender : data.genderDictionary[0])
    //     setDescription(data.description)
    //     setAge(data.age)
    //     setImageUrl(data.url)
    //     setOldImageUrl(data.url)
    //   })
    //   .catch((error) => {
    //     console.error("Wystąpił błąd:", error);
    //   });
    axios
      .get("http://127.0.0.1:3000/get_profile_config", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        setGenderOptions(data.genderDictionary);
        setGender(data.gender ? data.gender : data.genderDictionary[0]);
        setDescription(data.description);
        setAge(data.age);
        setImageUrl(data.url);
        setOldImageUrl(data.url);
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });
  }, []);

  const handleProfileImageChange = (e: any) => {
    const file = e.target.files[0];
    setProfileImage(file);
    //setOldImageUrl(imageUrl);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader?.result == "string") setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async (e: any) => {
    e.preventDefault();
    let url_photo_image = await handleUpload();
    const user_database = {
      age: age || "",
      gender: gender || "",
      description: description || "",
      url_photo_image: url_photo_image,
    };
    axios
      .post("http://127.0.0.1:3000/update_profile", user_database, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        // Przetwarzanie odpowiedzi od serwera po zaktualizowaniu profilu
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });
    // fetch("http://127.0.0.1:3000/update_profile", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "authorization": JSON.stringify(user),
    //   },
    //   body: JSON.stringify(user_database),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data)
    //     // Przetwarzanie odpowiedzi od serwera po zaktualizowaniu profilu
    //   })
    //   .catch((error) => {
    //     console.error("Wystąpił błąd:", error);
    //   });
    navigate("/slajder");
  };

  const SignOutOnClick = async () => {
    try {
      await signOut(auth);
      signOutAuthContext();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    navigate("/");
  };

  return (
    <div className="sign-Up-container">
      <form className="register-form" onSubmit={updateProfile}>
        <h1>Profile Configuration</h1>
        <h3 onClick={SignOutOnClick}>Wyloguj</h3>
        <input
          type="number"
          placeholder="Enter your age"
          value={age || ""}
          onChange={(e) => setAge(e.target.value)}
          className="register-input"
        />
        <label htmlFor="gender">Płeć:</label>
        <select
          id="gender"
          name="gender"
          value={gender || ""}
          onChange={(e) => {
            setGender(e.target.value);
          }}
        >
          {genderOptions.map((option: any) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>

        <label htmlFor="description">Opis:</label>
        <textarea
          id="description"
          name="description"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="profileImage">Zdjęcie profilowe:</label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
        <img src={imageUrl} alt="Zdjęcie" className="profile_photo" />

        <button type="submit" className="register-button">
          CONFIGURATION
        </button>
      </form>
    </div>
  );
}

export default Configuration;
