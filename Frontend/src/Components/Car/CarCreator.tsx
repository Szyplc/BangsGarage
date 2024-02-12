import React, { useEffect, useState, useContext } from "react";
import Gallery from "../Profile/Gallery/Gallery";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Input } from '@mui/material';
import AddPhotoToProfileGallery from "../Profile/AddPhotoToGallery/AddPhotoToProfileGallery";
import "./CarCreator.css"
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { loadCarsData } from "../../Store/carSlice";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../Store/authSlice";

function CarCreator() {
    const [carId, setCarId]  = useState<string>("")
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const user = useSelector(getUser)
    const [carData, setCarData] = useState({
        manufacturer: '',
        model: '',
        year: '',
        engineInfo: '',
        version: '',
        image: null,
        mileage: '',
    });

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setCarData({ ...carData, [name]: value });
    };
    useEffect(() => {
        axios.post("http://127.0.0.1:3000/create_car", {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(response => {
            setCarId(response.data)
            console.log(response.data)
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
          
    }, [])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        await axios.put("http://127.0.0.1:3000/update_car", {...carData, carId: carId }, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
          await dispatch(loadCarsData())
          navigate("/profile")
        console.log(carData);
    };

    const updateCarImageProfile = (name: string) => {
        console.log(name)
        axios.put("http://127.0.0.1:3000/updateCarMedia", { image: name, carId: carId, profile: true }, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
    }
  
  return (
    <div className="content">
    <div id="container">
        <h2>Create a new car</h2>
        <form onSubmit={handleSubmit}>
            <TextField
                label="Producent"
                name="manufacturer"
                value={carData.manufacturer}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Model"
                name="model"
                value={carData.model}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Rok produkcji"
                name="year"
                value={carData.year}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Informacje o silniku"
                name="engineInfo"
                value={carData.engineInfo}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Wersja/model"
                name="version"
                value={carData.version}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <AddPhotoToProfileGallery afterSend={(name: string) => { updateCarImageProfile(name) }} addingMenuProp={true} filePath={user?.uid + "/" + carId + "/"} addButton={false}></AddPhotoToProfileGallery>
            <TextField
                label="Przebieg"
                name="mileage"
                value={carData.mileage}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: "15px"}}>
                Wyślij
            </Button>
        </form>
      
    </div>
    </div>
  );
}

export default CarCreator;
