import React, { useEffect } from "react";
import "./UserCar.css"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CarsData, loadCarsData, setCarById } from "../../Store/carSlice";
import { AppDispatch } from "../../Store/store";

const UserCar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const cars = useSelector(CarsData)
    useEffect(() => {
        const asyncFunction = async () => {
            if(!cars.length)
                dispatch(loadCarsData())
            dispatch(setCarById(""))
        }
        asyncFunction()
    }, [])

    const navigate = useNavigate();


    const onCarClick = async (index: number) => {
        dispatch(setCarById(cars?.[index]?._id || ""))
        navigate("/carGallery")
    }

    return (
        <div>
            <div className="container" style={{ height: '100%' }}>
                {cars && cars.map((car, index) => (
                    <div key={index} className="car" onClick={() => onCarClick(index)}>
                        {car.profileUrl && <img src={car.profileUrl} alt="Car" />}
                        <div className="carInfo">
                            {index + 1}. Manufacturer: {car.Car_Specification.manufacturer}, 
                            Model: {car.Car_Specification.model}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserCar;
