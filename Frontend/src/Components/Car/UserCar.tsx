import React, { useEffect } from "react";
import "./UserCar.css"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CarsData, LikedCars, setCarById } from "../../Store/carSlice";
import { AppDispatch } from "../../Store/store";
import { CarData } from "../../../../types/types";

const UserCar = ({ type }: { type: string }) => {
    const dispatch = useDispatch<AppDispatch>();
    let cars: CarData[] = [];
    if(type == "/profile")
        cars = useSelector(CarsData)
    else if(type == "/liked_cars")
        cars = useSelector(LikedCars)
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
