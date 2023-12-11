import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  appContainer:{
    backgroundColor:"white",
    color:"black",
  },
  message: {
    backgroundColor: "green",
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
    backgroundColor: "#f5f5f5",
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
  aktywni: {
    position: "absolute",
    top: "20%", // Przesunięcie o 15% wysokości elementów 'messages' i 'requests'
    left: "0px",
    width: "100%", // Szerokość na 100% kontenera
    display: "flex", // Wyświetlanie elementów w rzędzie
    justifyContent: "space-evenly", // Rozłożenie elementów w równych odstępach
    alignItems: "center", // Wyśrodkowanie elementów w pionie
    padding: "0px",
  },
  konwersacje: {
    marginTop: "30vh",
     /* Określenie wysokości divu konwersacje */
    width: '100vw',
  },
  chatMessage: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  profileImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  messageContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  userName: {
    fontWeight: "bold",
    marginRight: "10px",
  },
  messageText: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "10px",
  },
}));


