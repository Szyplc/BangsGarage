import React, { useEffect, useState, useContext } from "react";
import Gallery from "../Profile/Gallery/Gallery";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Input } from '@mui/material';
import AddPhotoToProfileGallery from "../Profile/AddPhotoToGallery/AddPhotoToProfileGallery";
import "./CarCreator.css"
import axios, { AxiosError } from "axios";
import { AuthContext } from "../Auth/AuthContext";

function CarCreator() {
    const { user } = useContext(AuthContext);
    const [carId, setCarId]  = useState<string>("")
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

    const handleSubmit = (event: any) => {
        event.preventDefault();
        axios.put("http://127.0.0.1:3000/update_car", {...carData, carId: carId }, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
        console.log(carData);
    };

    const updateCarImageProfile = (name: string) => {
        console.log(name)
        axios.put("http://127.0.0.1:3000/updateCarProfileImage", { image: name, carId: carId }, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })
    }
  
  return (
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
            <AddPhotoToProfileGallery afterSend={(name: string) => { updateCarImageProfile(name) }} addingMenuProp={true} filePath={user?.uid + "/" + carId + "/"}></AddPhotoToProfileGallery>
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
  );
}

export default CarCreator;
