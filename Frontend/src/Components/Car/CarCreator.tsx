import React, { useEffect, useState } from "react";
import { TextField, } from '@mui/material';
import AddPhotoToProfileGallery from "../Profile/AddPhotoToGallery/AddPhotoToProfileGallery";
import "./CarCreator.css"
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { Car, loadCarsData, setCarByCar } from "../../Store/carSlice";
import { useNavigate } from "react-router-dom";
import { Car_Specification } from "../../../../types/types";
import { faRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CurrentTheme } from "../../Store/themeSlice";

function CarCreator() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const currentTheme = useSelector(CurrentTheme)
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
        axios.post("http://145.239.93.11:3000/create_car", {
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
        await axios.put("http://145.239.93.11:3000/update_car", {...carData, carId: carId }, {
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
      axios.delete("http://145.239.93.11:3000/delete_car", { data: { _id: carId } })
      dispatch(loadCarsData())
      navigate("/profile")
    }

  return (
    <div className="content" style={{ backgroundColor: currentTheme.DarkGray }} >
    <div id="container">
        <div style={{ display: "flex", justifyContent: "space-around", backgroundColor: currentTheme.Primary, color: currentTheme.LightGray, alignItems: "center" }}>
        <FontAwesomeIcon style={{ height: "50" }} onClick={undo} icon={faRotateLeft} />
          <h2>Create a new car</h2>
          {car && <FontAwesomeIcon style={{ height: "50" }} onClick={deleteCar} icon={faTrash} /> } 
        </div>
        <form style={{ padding: '30px', marginLeft: "20px", marginRight: "30px",  }} onSubmit={handleSubmit}>
            <TextField color="error" style={{ backgroundColor: currentTheme.White, color: currentTheme.Accent}}
                label="Producent"
                name="manufacturer"
                value={carData.manufacturer}
                onChange={handleChange}
                margin="normal"
                required
                type="text"
            />
            <TextField color="error" style={{ backgroundColor: currentTheme.White, color: currentTheme.Accent}}
                label="Model"
                name="model"
                value={carData.model || ""}
                onChange={handleChange}
                margin="normal"
                required
                type="text"
            />
            <TextField color="error" style={{ backgroundColor: currentTheme.White, color: currentTheme.Accent}}
                label="Rok produkcji"
                name="year"
                value={carData.year || ""}
                onChange={handleChange}
                margin="normal"
                required
                type="number"
            />
            <TextField color="error" style={{ backgroundColor: currentTheme.White, color: currentTheme.Accent}}
                label="Informacje o silniku"
                name="engineInfo"
                value={carData.engineInfo || ""}
                onChange={handleChange}
                margin="normal"
                type="text"
            />
            <TextField color="error" style={{ backgroundColor: currentTheme.White, color: currentTheme.Accent}}
                label="Wersja/model"
                name="version"
                value={carData.version || ""}
                onChange={handleChange}
                margin="normal"
                type="text"
            />
            <div>
              <AddPhotoToProfileGallery></AddPhotoToProfileGallery>
            </div>
            <TextField color="error" style={{ backgroundColor: currentTheme.White, color: currentTheme.Accent}}
                label="Przebieg"
                name="mileage"
                value={carData.mileage || ""}
                onChange={handleChange}
                margin="normal"
                type="number"
            />
            <div style={{ alignSelf: "center"}}><button type="submit" style={{ paddingLeft: "30px", paddingRight: "30px", marginTop: "15px", backgroundColor: currentTheme.Accent, color: currentTheme.LightGray }}>
                Zapisz
            </button></div>
        </form>
      
    </div>
    </div>
  );
}

export default CarCreator;
