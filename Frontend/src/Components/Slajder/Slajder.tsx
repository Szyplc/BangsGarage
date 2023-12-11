/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Slajder.css";
import "swiper/swiper-bundle.min.css";
import { useStyles } from "../../style"; // Import stylów z Material-UI
import SideMenu from "../../SideMenu/SideMenu";
import { DoubleClickEvent } from "../../App";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";

const Slajder: React.FC = () => {
  const [, setActiveIndex] = useState(0);
  const [data, setData] = useState([]);
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };
  const { heartColor, setHeartColor } = useContext(DoubleClickEvent);
  //Normalne dane każde serce generowane osobno do każdego slajda
  const handleChangeColor = () => {
    setHeartColor("#ff0000");
  };
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // fetch("http://127.0.0.1:3000/userzy", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //      "authorization": JSON.stringify(user),
      //   },
      //   body: JSON.stringify(user),
      // })
      //   .catch()
      //   .then((response) => response.json())
      //   .catch(error => {
      //     console.log(error)
      //   })
      //   .then((data: any) => setData(data));
      axios
        .post("http://127.0.0.1:3000/userzy", JSON.stringify(user), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log("Wystąpił błąd:", error);
        });
    }
  }, []);

  const classes = useStyles(); // Inicjalizacja stylów

  return (
    <div className={classes.sliderContainer}>
      <Swiper
        className="swiper-container"
        spaceBetween={50}
        slidesPerView={1}
        direction="vertical"
        onSlideChange={handleSlideChange}
      >
        {/*<SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-1.jpg"
            alt="Nature 1"
          />
          <SideMenu heartColorProp={heartColor}></SideMenu>
          <div className={classes.iconOverlay}>
            <FontAwesomeIcon icon={faStar} className={classes.starIcon} />
          </div>
          <Description></Description>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-2.jpg"
            alt="Nature 2"
          />
          <SideMenu heartColorProp={heartColor}></SideMenu>
          <div className={classes.iconOverlay}>
            <FontAwesomeIcon icon={faStar} className={classes.starIcon} />
          </div>
          <Description></Description>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-3.jpg"
            alt="Nature 3"
          />
          <SideMenu heartColorProp={heartColor}></SideMenu>
          <div className={classes.iconOverlay}>
            <FontAwesomeIcon icon={faStar} className={classes.starIcon} />
          </div>
          <Description></Description>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-4.jpg"
            alt="Nature 4"
          />
          <SideMenu heartColorProp={heartColor}></SideMenu>
          <div className={classes.iconOverlay}>
            <FontAwesomeIcon icon={faStar} className={classes.starIcon} />
          </div>
          <Description></Description>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-5.jpg"
            alt="Nature 5"
          />
          <SideMenu heartColorProp={heartColor}></SideMenu>
          <div className={classes.iconOverlay}>
            <FontAwesomeIcon icon={faStar} className={classes.starIcon} />
          </div>
          <Description></Description>
  </SwiperSlide>*/}
        {data.map((item: any) => (
          <SwiperSlide key={item._id}>
            <img
              onDoubleClick={handleChangeColor}
              src="https://swiperjs.com/demos/images/nature-4.jpg"
            />
            <SideMenu heartColorProp={heartColor}></SideMenu>
            <div className={classes.iconOverlay}>
              <FontAwesomeIcon icon={faStar} className={classes.starIcon} />
            </div>

            <div className={classes.opis}>
              <h3>
                {item.username} ({item.age})
              </h3>
              <div>{item.description}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slajder;
