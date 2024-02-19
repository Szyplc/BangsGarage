import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  sliderContainer: {
    position: "relative",
  },
  iconOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    margin: "16px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    color: "#000",
  },

  starIcon: {
    fontSize: "24px",
  },
  iconOverlay_profile: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column'
  },
  profil: {
    color: "white",
    fontSize: 50,
    padding: 10,
    marginTop: "40vh",
  },
  heart: {
    color: "white",
    fontSize: 50,
    padding: 8,
  },
  chat: {
    color: "white",
    fontSize: 50,
    margin: 10,
    position: "absolute",
    top: "50vh",
    left: "50%",
    transform: "translateX(-50%)",
  },
  opis: {
    color: "white",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "30vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "3px",
  },
  containerStyle: {
    //position: "fixed",
    left: "-0.1%",
    top: "42%",
    display: "flex",
  },
  iconStyle: {
    width: "4.5em",
    height: "5em",
    marginRight: "0.5em",
  },
}));
