import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Paper,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const useStyles = makeStyles(() => ({
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "90vh", // Ustawienie wysokości na 100% wysokości ekranu
    width: "90vw", // Ustawienie szerokości na 100% szerokości ekranu
    padding: "16px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  avatar: {
    marginRight: "8px",
    width: "40px",
    height: "40px",
  },
  username: {
    fontWeight: "bold",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "auto",
    marginBottom: "16px",
  },
  messageBubble: {
    display: "inline-block",
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: "20px",
    marginBottom: "8px",
  },
  senderBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
  },
  receiverBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f3f3",
  },
  messageText: {
    wordBreak: "break-word",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5vh",
  },
  inputField: {
    flexGrow: 1,
    marginRight: "8px",

  },
}));

const Chat = () => {
  const classes = useStyles();

  // Dane czatu
  const chatData = {
    user: {
      name: "John Doe",
      avatar: "https://swiperjs.com/demos/images/nature-1.jpg",
    },
    messages: [
      { id: 1, sender: "John", message: "Hello!" },
      { id: 2, sender: "Jane", message: "Hi there!" },
      // Dodaj inne wiadomości...
    ],
  };

  return (
    <Paper elevation={3} className={classes.chatContainer}>
      <div className={classes.header}>
        <Avatar
          className={classes.avatar}
          alt={chatData.user.name}
          src={chatData.user.avatar}
        />
        <Typography variant="h6" className={classes.username}>
          {chatData.user.name}
        </Typography>
      </div>
      <div className={classes.messageContainer}>
        {chatData.messages.map((msg) => (
          <div
            key={msg.id}
            className={`${classes.messageBubble} ${
              msg.sender === "John"
                ? classes.senderBubble
                : classes.receiverBubble
            }`}
          >
            <Typography variant="body1" className={classes.messageText}>
              {msg.message}
            </Typography>
          </div>
        ))}
      </div>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.inputField}
          variant="outlined"
          placeholder="Wpisz wiadomość..."
        />
        <IconButton>
          <SendIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

export default Chat;
