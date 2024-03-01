/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "./Slajder.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { CarToShowIndex, CarsToShow, getCarToShow, setCarToShowIndex } from "../../Store/carSlice";
import SwiperWithMedia from "./SwiperWithMedia/SwiperWithMedia";
import { CarData } from "../../../../types/types";

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
    if(carToShowIndex >= (carsToShow.length - 2)) {
      dispatch(getCarToShow(carsToShow.length))
    }
  }, [carToShowIndex])

  return (
      <Swiper
        className="swiper-container"
        spaceBetween={50}
        slidesPerView={1}
        direction="vertical"
        onSlideChange={handleSlideChange}
      >
        {carsToShow.map((item: CarData, index: number) => (
          <SwiperSlide key={item._id}>
            <SwiperWithMedia mediaProp={item.media} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
  );
};

export default Slajder;
