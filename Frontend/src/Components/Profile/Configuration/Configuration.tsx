import { signOut } from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { auth, storage } from "../../../base";
import "./Configuration.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContext";
import axios from "axios";

function Configuration() {
  const default_photo_image = "https://firebasestorage.googleapis.com/v0/b/bangsgarage.appspot.com/o/config%2Fdefault_profile_image.png?alt=media&token=48953722-672d-4f36-9571-75a0c418059b";
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [genderOptions, setGenderOptions] = useState([]);
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState<any>(null);
  const [userPhoto, setUserPhoto] = useState<string>(default_photo_image);
  const {
    user,
    signOutAuthContext,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpload = async (title_new_photo: File) => {
   //usuwanie starego
   if(userPhoto != default_photo_image)
    deletePhoto(userPhoto)
   //dodawanie nowego i zwrocenie nowego url
    let url_new_photo = await addPhoto(title_new_photo)
    console.log(url_new_photo)
    setUserPhoto(url_new_photo)
    //baza danych update
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
        let obj: any = Object.entries(data.genderDictionary).map(([key, value]) => ({
          _id: key,
          name: value
        }));
        setGenderOptions(obj);
        setGender(data.gender ? data.gender : data.genderDictionary[0]);
        setDescription(data.description);
        setAge(data.age);
        setUserPhoto(data.url);
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });

      axios.get("http://127.0.0.1:3000/get_profile_image", {
        headers: {
          "Content-Type": "application/json",
        }}).then((res: any) => {
          setUserPhoto(res.data)
        })
  }, []);

  const handleProfileImageChange = (e: any) => {
    const file = e.target.files[0];
    setProfileImage(file);
    console.log(file)
    //setOldImageUrl(imageUrl);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader?.result == "string") handleUpload(file);
    };
    reader.readAsDataURL(file);
  };
  
  const deletePhoto = (url: string) => {
    if(url != default_photo_image)
    {
      const filetoDel = storage.refFromURL(url);
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
  }

  const addPhoto = async (file: File): Promise<string> => {
    try 
    {
      const storageRef = storage.ref();
      let name = user?.uid + "/profile_image/" + file.name;
      const fileRef = storageRef.child(name);
      await fileRef.put(file)
      const url = await fileRef.getDownloadURL()
      return url
    }
    catch (err) {
      throw new Error("Nie udulo sie przeslac zdjecia")
    }
  }

  const updateProfile = async (e: any) => {
    e.preventDefault();
    
    const user_database = {
      age: age || "",
      gender: gender || "",
      description: description || "",
      url_photo_image: userPhoto,
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

  const DeleteProfilePicture = () => {
    deletePhoto(userPhoto);
    setUserPhoto(default_photo_image);
    setProfileImage("")
  }

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
        <img src={userPhoto} alt="Zdjęcie" className="profile_photo" />
        <div onClick={DeleteProfilePicture}>Usun zdjęcie profilowe</div>
        <button type="submit" className="register-button">
          CONFIGURATION
        </button>
      </form>
    </div>
  );
}

export default Configuration;
