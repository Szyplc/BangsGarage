import { Avatar } from "@mui/material";
import "swiper/swiper.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useStyles } from "./RequestsStyle";
import { Link } from "react-router-dom";

const Requests = () => {
  const classes = useStyles();

  return (
    <div>
      <Link to="/messages">
        <button className={classes.message}>messages</button>
      </Link>
      <Link to="/requests">
        <button className={classes.request}>requests</button>
      </Link>
      <div className={classes.diw}>
        <Swiper
          direction="vertical"
          spaceBetween={10}
          slidesPerView={8}
          style={{ height: "80vh" }}
        >
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-1.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-2.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-3.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-4.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-5.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-6.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-7.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-8.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-9.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-10.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={classes.invitationCard}>
              <div className={classes.userInfo}>
                <Avatar
                  className={classes.userPhoto}
                  src="https://swiperjs.com/demos/images/nature-1.jpg"
                  alt="Rounded Image"
                />
                <span className={classes.userLogin}>JohnDoe</span>
              </div>
              <div className={classes.actions}>
                <button className={classes.acceptButton}>Accept</button>
                <button className={classes.rejectButton}>Reject</button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Requests;
