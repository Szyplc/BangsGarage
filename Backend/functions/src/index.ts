import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';


admin.initializeApp();

const app = express();
const UserSchema = new mongoose.Schema({
 // _id: mongoose.Schema.Types.ObjectId,
  uid: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String },
  media: { type: Array }
});

/*const ChatRoomSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const ConversationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  _id_chat_room: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
});


const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const Conversation = mongoose.model('Conversation', ConversationSchema);*/

const User = mongoose.model('User', UserSchema);


app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*'); 
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
  } else {
    next();
  }
});

const uri = 'mongodb+srv://generalkenobi1919:X3AdbUJMjhaCI8RN@cluster0.zcokpld.mongodb.net/Praktyki';

const options: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions;

mongoose.connect(uri, options)
  .then(() => {
    console.log('Połączono z bazą danych MongoDB');
  })
  .catch((error) => {
    console.error('Błąd połączenia z bazą danych MongoDB', error);
  });

export const db = functions.https.onRequest((request, response) => {
  response.send('Połączono z bazą danych MongoDB');
});

app.get('/register',(req,res)=>{
  res.send("register");
})
app.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const idToken = req.body.userCredential._tokenResponse.idToken;

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    console.log('Token jest ważny i został wygenerowany przez Firebase.');
    console.log(decodedToken);

    const user = new User({
      uid: req.body.userCredential.user.uid,
      username: req.body.username,
      email: req.body.userCredential.user.email
    });

    console.log(user);

    await user.save();
    console.log('Użytkownik został zapisany w bazie danych MongoDB');

    res.send({ status: 'OK' });
  } catch (error) {
    console.error('Błąd podczas rejestracji użytkownika:', error);
    res.status(500).json({ success: false, message: 'Wystąpił błąd serwera' });
  }
});
app.get('/send_photo',(req,res)=>{
  res.send("send_photo")
})

app.post('/send_photo',async (req,res)=>{
  try {
    const authHeader = req.headers.authorization;
    const user = authHeader ? JSON.parse(JSON.parse(authHeader)) : undefined;
    const token = user._tokenResponse.idToken;
    const receivedFilePath = req.body.filePath;

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token jest ważny i został wygenerowany przez Firebase.');
    console.log(decodedToken);

    await User.findOneAndUpdate({ uid: decodedToken.user_id }, { $push: { media: receivedFilePath } });

    console.log('Dokument został zaktualizowany');

    console.log('Otrzymana ścieżka:', receivedFilePath);

    res.json({ success: true, message: 'Ścieżka została pomyślnie odebrana przez serwer' });
  } catch (error) {
    console.error('Błąd podczas aktualizacji dokumentu:', error);
    res.status(500).json({ success: false, message: 'Wystąpił błąd serwera' });
  }
});

app.get("/galery", (req,res)=>{
  res.send("galery");
})

app.post("/galery", async (req,res)=>{
  const tokenId = req.headers.authorization ? JSON.parse(req.headers.authorization) : undefined;
  var decoded;
  var doc;
  await admin
  .auth()
  .verifyIdToken(tokenId)
  .then(async (decodedToken) => {
    decoded = decodedToken;
    console.log(decodedToken);
    await User.findOne({ uid: decoded.user_id })
    .then((document) => {
      doc = document
    })
    .catch((error) => {
      console.error('Błąd podczas odczytu dokumentu:', error);
      doc = error;
    });

  })
  //console.log("doc to:", doc)
  res.json(JSON.stringify(doc))
  });




exports.node = functions.https.onRequest(app);