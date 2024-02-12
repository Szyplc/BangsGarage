import React, { useEffect, useState, useContext } from "react";
import "./UserCar.css"
import { useNavigate } from "react-router-dom";
import { CarData, Media } from "../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { CarsData, getCarsId, loadCarsData, setCar } from "../../Store/carSlice";
import { AppDispatch } from "../../Store/store";

const UserCar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const cars = useSelector(CarsData)
    useEffect(() => {
        const asyncFunction = async () => {
            if(!cars)
                dispatch(loadCarsData())
        }
        asyncFunction()
    }, [])

    const navigate = useNavigate();


    const onCarClick = async (index: number) => {
        dispatch(setCar(cars?.[index]?._id || ""))
        navigate("/carGallery")
    }

    return (
        <div>
        <div className="container" style={{ height: '100%' }}>
            {cars && cars.map((car, index) => (
                <div key={index} className="car" onClick={() => onCarClick(index)}>
                    {car.profileUrl && <img src={car.profileUrl} alt="Car" />}
                    <div className="carInfo">
                        {index + 1}. Manufacturer: {car.Car_Specification.Manufacturer}, 
                        Model: {car.Car_Specification.Model}
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default UserCar;
