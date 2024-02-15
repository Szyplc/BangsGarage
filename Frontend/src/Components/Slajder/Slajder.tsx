/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Slajder.css";
//import "swiper/swiper-bundle.min.css";
import { useStyles } from "../../style"; // Import stylów z Material-UI
import SideMenu from "../../SideMenu/SideMenu";
import { DoubleClickEvent } from "../../App";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../Store/authSlice";
import { AppDispatch } from "../../Store/store";
import { CarsToShow, getCarToShow } from "../../Store/carSlice";
import SwiperWithMedia from "../SwiperWithMedia/SwiperWithMedia";

const Slajder: React.FC = () => {
  const [, setActiveIndex] = useState(0);
  const user = useSelector(getUser)
  const dispatch = useDispatch<AppDispatch>()
  const carsToShow = useSelector(CarsToShow)
  console.log(carsToShow)
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };
  const { heartColor, setHeartColor } = useContext(DoubleClickEvent);
  //Normalne dane każde serce generowane osobno do każdego slajda
  const handleChangeColor = () => {
    setHeartColor("#ff0000");
  };

  useEffect(() => {
    const asyncFunction = async () => {
      dispatch(getCarToShow(1))
    }
    asyncFunction()
  }, []);

  const classes = useStyles(); // Inicjalizacja stylów

  return (
    <div>
    {carsToShow[0]?.media && <SwiperWithMedia mediaProp={carsToShow[0]?.media}></SwiperWithMedia>}
      {/*<Swiper
        className="swiper-container"
        spaceBetween={50}
        slidesPerView={1}
        direction="vertical"
        onSlideChange={handleSlideChange}
      >
        
        {data.map((item: any) => (
          <SwiperSlide key={item._id}>
            <SideMenu heartColorProp={heartColor}></SideMenu>
            <SwiperWithMedia mediaProp={carsToShow[0]?.media}></SwiperWithMedia>
          </SwiperSlide>
        ))}
      </Swiper>*/}
        </div>
  );
};

export default Slajder;
