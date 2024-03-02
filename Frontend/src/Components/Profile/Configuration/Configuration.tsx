//import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {  storage } from "../../../base";
import "./Configuration.css";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../Store/authSlice";
import { AppDispatch } from "../../../Store/store";
import { signOut } from "../../../Store/authSlice"
import { faImage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CurrentTheme } from "../../../Store/themeSlice";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";

function Configuration() {
  const default_photo_image = "https://firebasestorage.googleapis.com/v0/b/bangsgarage.appspot.com/o/config%2Fdefault_profile_image.png?alt=media&token=48953722-672d-4f36-9571-75a0c418059b";
  const [username, setUsername] = useState("")
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [genderOptions, setGenderOptions] = useState([]);
  const [description, setDescription] = useState("");
  const [userPhoto, setUserPhoto] = useState<string>(default_photo_image);
  const user = useSelector(getUser)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const currentTheme = useSelector(CurrentTheme)

  const handleUpload = async (title_new_photo: File) => {
   if(userPhoto != default_photo_image)
    deletePhoto(userPhoto)

    let url_new_photo = await addPhoto(title_new_photo)
    setUserPhoto(url_new_photo)
  };

  useEffect(() => {
    axios
      .get("http://145.239.93.11:3000/user", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        const data = res.data;
        let obj: any = Object.entries(data.genderDictionary).map(([key, value]) => ({
          _id: key,
          name: value
        }));
        setUsername(data.username)
        setGenderOptions(obj);
        setGender(data.gender ? (data.gender).toUpperCase() : data.genderDictionary.MALE);
        setDescription(data.description);
        setAge(data.age);
        setUserPhoto(data.url);
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });

      axios.get("http://145.239.93.11:3000/profile_image", {
        headers: {
          "Content-Type": "application/json",
        }}).then((res: AxiosResponse) => {
          setUserPhoto(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const file = e.target.files[0];//setOldImageUrl(imageUrl);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader?.result == "string") handleUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const deletePhoto = (url: string) => {
    if(url != default_photo_image && url != "")
    {
      try {
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
      } catch (err) {
        console.error(err)
      }
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
      console.error(err)
      return "Error"
    }
  }

  const updateProfile = async (e: any) => {
    e.preventDefault();
    console.log(gender)
    const user_database = {
      username: username || "",
      age: age || "",
      gender: gender || "",
      description: description || "",
      url_photo_image: userPhoto,
    };
    axios
      .post("http://145.239.93.11:3000/update_profile", user_database, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });
    navigate("/slajder");
  };

  const SignOutOnClick = async () => {
    try {
      dispatch(signOut())
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    navigate("/");
  };

  return (
    <div className="sign-Up-container">
      <div style={{ color: currentTheme.LightGray, backgroundColor: currentTheme.Background, width: '100%', position: "fixed", top: 0 }}>
        <h2 style={{ marginLeft: "7vw"}}>Profile Configuration</h2>
        <FontAwesomeIcon onClick={SignOutOnClick} style={{ right: '2vw', position: 'fixed', top: '2vh', height: "40px", width: "40px" }} icon={faRightFromBracket} />
      </div>
      <form className="config-form" onSubmit={updateProfile} style={{ backgroundColor: currentTheme.LightGray, width: "80%", height: "80%", borderRadius: "10px"}}>
        <h4>{user?.email}</h4>
        <TextField color="error" type="text"  style={{ marginBottom: "2vh", backgroundColor: currentTheme.White }} 
          placeholder="username"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />

        <TextField color="error" style={{ backgroundColor: currentTheme.White}}
          type="number"
          placeholder="Enter your age"
          value={age || ""}
          onChange={(e) => setAge(e.target.value)}
          className="register-input"
        />
        <InputLabel id="label-gender" htmlFor="gender">Płeć:</InputLabel>
        <Select color="error" style={{ backgroundColor: currentTheme.White}}
          id="gender"
          labelId="label-gender"
          name="gender"
          value={gender || ""}
          onChange={(e) => {
            setGender(e.target.value);
          }}
        >
          {genderOptions.map((option: { _id: string, name: string}) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>

        <label htmlFor="description">Opis:</label>
        <TextField color="error" multiline style={{ backgroundColor: currentTheme.White}}
          id="description"
          name="description"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="profileImage">Zdjęcie profilowe:</label>
        <div style={{ display: "flex", justifyContent: "space-evenly"}}>
          <label htmlFor="file-input" style={{ verticalAlign: "center", margin: "10px"}}>
            <FontAwesomeIcon  style={{ height: "70px", color: currentTheme.White }} icon={faImage} />
            <input
              type="file"
              id="file-input"
              name="profileImage"
              accept="image/*"
              onChange={handleProfileImageChange} 
              style={{ display: 'none'}}
            />
          </label>
          <img src={userPhoto} alt="Zdjęcie" className="profile_photo" />
          </div>
        <button type="submit" className="register-button" style={{ backgroundColor: currentTheme.Accent }}>
          CONFIGURATION
        </button>
      </form>
    </div>
  );
}

export default Configuration;
