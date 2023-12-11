import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  appContainer:{
    backgroundColor:"white",
    color:"black",
  },
  message: {
    backgroundColor: "#f5f5f5",
    position: "absolute",
    top: "0px",
    width: "50%",
    height: "15%",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  request: {
    backgroundColor: "green",
    position: "absolute",
    top: "0px",
    right: "0px",
    width: "50%",
    height: "15%",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  diw: {
    width: "100vw",
    marginTop: "15vh",
    marginBottom: "15vh",
    height: "100%",
  },
  invitationCard: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "8px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  userPhoto: {
    width: "100%", 
    height: "auto", 
    borderRadius: "50%",
    marginRight: "8px",
  },
  userLogin: {
    fontWeight: "bold",
  },
  actions: {
    marginLeft: "auto",
  },
  acceptButton: {
    padding: "10px",
    marginLeft: "8px",
    color: "white",
    backgroundColor: "green",
  },
  rejectButton: {
    padding: "10px",
    marginLeft: "8px",
    color: "white",
    backgroundColor: "red",
  },
}));


