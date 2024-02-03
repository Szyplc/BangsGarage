import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import "./UserCar.css"
import { useNavigate } from "react-router-dom";
import { CarData, Media } from "../../types/types";

const UserCar: React.FC = () => {
    const { getCarsId, getCarData, getMediaFullUrl } = useContext(AuthContext);
    const [cars, setCars] = useState<CarData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCars = async () => {
            //gdy mamy id auta dopytujemy o jego dane
            const loadCarData = async (carId: string) => {
                try {
                    const carData: CarData = await getMediaFullUrl((await getCarData(carId)).data);
                    setCars(prevCars => [...prevCars, carData]);
                } catch (error) {
                    console.error("Błąd podczas ładowania danych samochodu:", error);
                }
            };

            //pytamy sie jakie mamy auta
            const loadCarsId = async () => {
                try {
                    const carIds: string[] = await getCarsId();
                    if(carIds.length > cars.length)
                        carIds.forEach(loadCarData); // Ładowanie danych każdego samochodu osobno
                } catch (error) {
                    console.error("Błąd przy ładowaniu ID samochodów:", error);
                }
            };
            
            loadCarsId();
        };

        loadCars();
    }, []);

    const onCarClick = async (index: number) => {
        navigate("/carGallery", { state: { car: await cars[index] } })
    }

    return (
        <div>
        <div className="container" style={{ height: '100%' }}>
            {cars.map((car, index) => (
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
