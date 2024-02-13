import React, { useEffect, useState } from "react";
import { TextField, Button } from '@mui/material';
import AddPhotoToProfileGallery from "../Profile/AddPhotoToGallery/AddPhotoToProfileGallery";
import "./CarCreator.css"
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { Car, loadCarsData } from "../../Store/carSlice";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../Store/authSlice";
import { Car_Specification } from "../../../../types/types";

function CarCreator() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const user = useSelector(getUser)
    const car = useSelector(Car)
    const [carId, setCarId]  = useState<string>(car?._id || "")
    const [carData, setCarData] = useState<Car_Specification>({
        manufacturer: '',
        model: '',
        year: 0,
        engineInfo: '',
        version: '',
        mileage: 0,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCarData({ ...carData, [name]: value });
    };
    useEffect(() => {
      console.log(car)
      if(!carData)
      {
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
      }
      else {
        if(car?.Car_Specification)
          setCarData(car?.Car_Specification)
      }
          
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await axios.put("http://127.0.0.1:3000/update_car", {...carData, carId: carId }, {
          headers: {
            "Content-Type": "application/json",
          }
        })
        .catch((error: AxiosError) => {
          console.error("Wystąpił błąd:", error);
        })
        dispatch(loadCarsData())
        navigate("/profile")
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

    const undo = () => {
      navigate(-1)
    }
  
  return (
    <div className="content">
    <div id="container">
        <div onClick={undo}>Cofnij</div>
        <h2>Create a new car</h2>
        <form onSubmit={handleSubmit}>
            <TextField
                label="Producent"
                name="manufacturer"
                value={carData.manufacturer || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Model"
                name="model"
                value={carData.model || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Rok produkcji"
                name="year"
                value={carData.year || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Informacje o silniku"
                name="engineInfo"
                value={carData.engineInfo || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Wersja/model"
                name="version"
                value={carData.version || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            
            <AddPhotoToProfileGallery afterSend={(name: string) => { updateCarImageProfile(name) }} addingMenuProp={true} 
            filePath={user?.uid + "/" + carId + "/"} addButton={false} imageSource={car?.profileUrl || ""}></AddPhotoToProfileGallery>
            
            <TextField
                label="Przebieg"
                name="mileage"
                value={carData.mileage || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: "15px" }}>
                Wyślij
            </Button>
        </form>
      
    </div>
    </div>
  );
}

export default CarCreator;
