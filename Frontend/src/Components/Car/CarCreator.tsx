import React, { useEffect, useState } from "react";
import { TextField, Button } from '@mui/material';
import AddPhotoToProfileGallery from "../Profile/AddPhotoToGallery/AddPhotoToProfileGallery";
import "./CarCreator.css"
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { Car, loadCarsData, setCarByCar } from "../../Store/carSlice";
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
      if(!car)
      {
        axios.post("http://127.0.0.1:3000/create_car", {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(response => {
            const newCar = response.data
            setCarId(newCar._id)
            dispatch(setCarByCar(newCar))
          })
          .catch((error: AxiosError) => {
            console.error("Wystąpił błąd:", error);
          })  
      }
      else {
        console.log("auto istnieje")
        if(car?.Car_Specification)
          setCarData(car?.Car_Specification)
      }
          
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(carData)
        let res = await axios.put("http://127.0.0.1:3000/update_car", {...carData, carId: carId }, {
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

    const undo = () => {
      navigate(-1)
    }

    const deleteCar = async () => {
      axios.delete("http://127.0.0.1:3000/delete_car", { data: { _id: carId } })
      dispatch(loadCarsData())
      navigate("/profile")
    }
  
  return (
    <div className="content">
    <div id="container">
        <div onClick={undo}>Cofnij</div>
        <h2>Create a new car</h2>
        {car && <button onClick={deleteCar}>Usun</button> }
        <form onSubmit={handleSubmit}>
            <TextField
                label="Producent"
                name="manufacturer"
                value={carData.manufacturer || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                type="text"
            />
            <TextField
                label="Model"
                name="model"
                value={carData.model || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                type="text"
            />
            <TextField
                label="Rok produkcji"
                name="year"
                value={carData.year || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                type="number"
            />
            <TextField
                label="Informacje o silniku"
                name="engineInfo"
                value={carData.engineInfo || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="text"
            />
            <TextField
                label="Wersja/model"
                name="version"
                value={carData.version || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="text"
            />
            
            <AddPhotoToProfileGallery></AddPhotoToProfileGallery>
            
            <TextField
                label="Przebieg"
                name="mileage"
                value={carData.mileage || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
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
