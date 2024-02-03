import React from "react";
import { useStyles } from "./MessagesStyle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Avatar } from "@mui/material";
//import "swiper/swiper.min.css";
import { Link } from "react-router-dom";

const Messages: React.FC = () => {
  const classes = useStyles();

  return (
    <div>
      <Link to="/messages">
        <button className={classes.message}>messages</button>
      </Link>
      <Link to="/requests">
        <button className={classes.request}>requests</button>
      </Link>
      <div className={classes.aktywni}>
        <Swiper spaceBetween={1} slidesPerView={5} centeredSlides={false}>
          <SwiperSlide>
            <Link to="/chat">
            <Avatar
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              alt="Rounded Image"
              sx={{ width: 75, height: 75 }}
            />
            </Link>          
          </SwiperSlide>
          <SwiperSlide>
            <Avatar
              src="https://swiperjs.com/demos/images/nature-2.jpg"
              alt="Rounded Image"
              sx={{ width: 75, height: 75 }}
            />
          </SwiperSlide>

          <SwiperSlide>
            <Avatar
              src="https://swiperjs.com/demos/images/nature-3.jpg"
              alt="Rounded Image"
              sx={{ width: 75, height: 75 }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Avatar
              src="https://swiperjs.com/demos/images/nature-4.jpg"
              alt="Rounded Image"
              sx={{ width: 75, height: 75 }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Avatar
              src="https://swiperjs.com/demos/images/nature-5.jpg"
              alt="Rounded Image"
              sx={{ width: 75, height: 75 }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Avatar
              src="https://swiperjs.com/demos/images/nature-6.jpg"
              alt="Rounded Image"
              sx={{ width: 75, height: 75 }}
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className={classes.konwersacje}>
        <Swiper
          direction="vertical"
          spaceBetween={10}
          slidesPerView={2}
          style={{ height: "50vh" }}
        >
          <SwiperSlide>
            <div className={classes.chatMessage}>
              <Avatar
                className={classes.profileImage}
                src="https://swiperjs.com/demos/images/nature-1.jpg"
                alt="Rounded Image"
                sx={{ width: 75, height: 75 }}
              />
              <div className={classes.messageContent}>
                <div className={classes.userName}>John Doe</div>
                <div className={classes.messageText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris consequat finibus nunc id congue.
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.chatMessage}>
              <Avatar
                className={classes.profileImage}
                src="https://swiperjs.com/demos/images/nature-2.jpg"
                alt="Rounded Image"
                sx={{ width: 75, height: 75 }}
              />
              <div className={classes.messageContent}>
                <div className={classes.userName}>Jane Smith</div>
                <div className={classes.messageText}>
                  Ut venenatis finibus eros, et laoreet mauris vehicula eu.
                  Aenean condimentum urna non odio sagittis malesuada.
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.chatMessage}>
              <Avatar
                className={classes.profileImage}
                src="https://swiperjs.com/demos/images/nature-3.jpg"
                alt="Rounded Image"
                sx={{ width: 75, height: 75 }}
              />
              <div className={classes.messageContent}>
                <div className={classes.userName}>Michael Johnson</div>
                <div className={classes.messageText}>
                  Sed ullamcorper diam vitae metus eleifend, eget blandit mauris
                  condimentum.
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.chatMessage}>
              <Avatar
                className={classes.profileImage}
                src="https://swiperjs.com/demos/images/nature-4.jpg"
                alt="Rounded Image"
                sx={{ width: 75, height: 75 }}
              />
              <div className={classes.messageContent}>
                <div className={classes.userName}>Michael Johnson</div>
                <div className={classes.messageText}>
                  Sed ullamcorper diam vitae metus eleifend, eget blandit mauris
                  condimentum.
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.chatMessage}>
              <Avatar
                className={classes.profileImage}
                src="https://swiperjs.com/demos/images/nature-5.jpg"
                alt="Rounded Image"
                sx={{ width: 75, height: 75 }}
              />
              <div className={classes.messageContent}>
                <div className={classes.userName}>Michael Johnson</div>
                <div className={classes.messageText}>
                  Sed ullamcorper diam vitae metus eleifend, eget blandit mauris
                  condimentum.
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.chatMessage}>
              <Avatar
                className={classes.profileImage}
                src="https://swiperjs.com/demos/images/nature-6.jpg"
                alt="Rounded Image"
                sx={{ width: 75, height: 75 }}
              />
              <div className={classes.messageContent}>
                <div className={classes.userName}>Michael Johnson</div>
                <div className={classes.messageText}>
                  Sed ullamcorper diam vitae metus eleifend, eget blandit mauris
                  condimentum.
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Messages;
