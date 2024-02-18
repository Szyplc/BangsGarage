/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
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
import { CarToShowIndex, CarsToShow, getCarToShow, setCarToShowIndex } from "../../Store/carSlice";
import SwiperWithMedia from "../SwiperWithMedia/SwiperWithMedia";

const Slajder: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const carToShowIndex = useSelector(CarToShowIndex)
  const carsToShow = useSelector(CarsToShow)
  const handleSlideChange = async (swiper: SwiperClass) => {
    dispatch(setCarToShowIndex(swiper.activeIndex))
  };

  useEffect(() => {
    const asyncFunction = async () => {
      dispatch(getCarToShow(0))
      dispatch(getCarToShow(1))
      dispatch(getCarToShow(2))
    }
    asyncFunction()
  }, []);

  useEffect(() => {
    console.log("-----------------------")
    console.log("carToShowIndex: ", carToShowIndex)
    console.log("CarsToShow length: ", carsToShow.length)
    if(carToShowIndex >= (carsToShow.length - 2)) {
      dispatch(getCarToShow(carsToShow.length))
    }
  }, [carToShowIndex])

  const { heartColor, setHeartColor } = useContext(DoubleClickEvent);
  //Normalne dane każde serce generowane osobno do każdego slajda
  const handleChangeColor = () => {
    setHeartColor("#ff0000");
  };

  const classes = useStyles(); // Inicjalizacja stylów

  return (
    <div>
    {/*carsToShow[0]?.media && <SwiperWithMedia mediaProp={carsToShow[0]?.media}></SwiperWithMedia>*/}
      <Swiper
        className="swiper-container"
        spaceBetween={50}
        slidesPerView={1}
        direction="vertical"
        onSlideChange={handleSlideChange}
        style={{ backgroundColor: "rebeccapurple"}}
      >
        
        {carsToShow.map((item: any) => (
          <SwiperSlide key={item._id}>
            <SideMenu heartColorProp={heartColor}></SideMenu>
            <SwiperWithMedia mediaProp={item.media}></SwiperWithMedia>
          </SwiperSlide>
        ))}
      </Swiper>
        </div>
  );
};

export default Slajder;
