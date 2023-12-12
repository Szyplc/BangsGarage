const { User, Chat_room, Conversation, Media, GenderEnum } = require('./schema.js');
import mongoose from 'mongoose';
import cors from "cors"
import { MongoClient, ObjectId } from 'mongodb';
import express from 'express';
import bodyParser from "body-parser";
//firebase
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import admin from 'firebase-admin';
const serviceAccount = require('./bangsgarage-firebase-adminsdk-o8ms7-ad6dd68035.json');

const uri = 'mongodb+srv://generalkenobi1919:X3AdbUJMjhaCI8RN@cluster0.zcokpld.mongodb.net/Praktyki';
const app = express();
app.use(express.json());
app.use(cors());
//app.use(bodyParser.json());

let storage, bucket: any;
async function firebase_connection() {
  
  const firebaseConfig = {
    apiKey: "AIzaSyCs-RZVFpzaVgUmq2t58iMCgPW3qHqZkrU",
    authDomain: "bangsgarage.firebaseapp.com",
    projectId: "bangsgarage",
    storageBucket: "bangsgarage.appspot.com",
    messagingSenderId: "926812595227",
    appId: "1:926812595227:web:efb9a53a59ee75f03404be",
    measurementId: "G-QSD5N1NVLE"
  };
  
  await admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })

  await initializeApp(firebaseConfig);
  storage = admin.storage();
  bucket = storage.bucket("bangsgarage.appspot.com");
}

async function con() {

  await mongoose.connect(uri)
    .then(() => {
      console.log("Polaczono z baza danych")
    })
  const db = mongoose.connection;
  return db;
}

const firebaseAuthMiddleware = async (req: any, res: any, next: any) => {
  if(req.path != "/register") {
    try {
      const authHeader = req.headers.authorization
      let authToken
      if(authHeader)
        authToken = authHeader.split(" ")[1];
      if(!authToken) {
        throw new Error('Brak tokena uwierzytelniającego');
      }
      // Zweryfikuj token uwierzytelniający za pomocą Firebase
      const decodedToken = await admin.auth().verifyIdToken(authToken)
      console.log("Zalogowano jako: ", decodedToken.uid)
      req.decodedToken = decodedToken; // Dodaj użytkownika do obiektu żądania
      next(); // Przejdź do następnego middleware lub obsługi żądania
    } catch (error) {
      console.error('Błąd uwierzytelniania Firebase. endpoint: ', req.path);
      res.status(401).json({ error: 'Nieprawidłowy token uwierzytelniający' });
    }
  }
  else {
    return next();
  }
};

async function main() {
  let db = await con()
  db.on('error', console.error.bind(console, 'Błąd połączenia:'));
  const col = db.collection("Praktyki");
  firebase_connection();
}

app.use(firebaseAuthMiddleware)
main()

//Endpoint
app.post('/send_photo', (req: any, res) => {  
  const receivedFilePath = req.body.filePath;
  let url_path = receivedFilePath.split(".appspot.com");
  url_path = url_path[1]
  url_path = url_path.split("?")[0]
  url_path = url_path.split("/")[url_path.split("/").length - 1];
  url_path = url_path.replace('%2F', '/')
  url_path = decodeURI(url_path)

  User.findOneAndUpdate({uid: req.decodedToken.user_id}, {$push: { media: url_path}})
  .then(() => {
    console.log('Dokument został zaktualizowany');
  })
  .catch((error) => {
    console.error('Błąd podczas aktualizacji dokumentu:', error);
  });

  res.json({ success: true, message: 'Ścieżka została pomyślnie odebrana przez serwer' });
});

app.post('/register', async (req, res) => {
  const userData = {
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    email: req.body.userCredential.user.email,
    uid: req.body.userCredential.user.uid,
    localization: req.body.localization
  };
  console.log(req.body.localization)
  // Tworzenie nowego użytkownika
  const newUser = new User(userData);
  // Zapisywanie użytkownika do bazy danych
  let savedUser = await newUser.save()
  .catch((error: any) => {
    console.error('Wystąpił błąd podczas zapisywania użytkownika:', error);
  });

  const image_profile_picture = {
    _id: new mongoose.Types.ObjectId(),
    user_id: savedUser._id,
    url: "https://firebasestorage.googleapis.com/v0/b/bangsgarage.appspot.com/o/config%2Fdefault_profile_image.png?alt=media&token=48953722-672d-4f36-9571-75a0c418059b",
    profile: true
  }
  const media = new Media(image_profile_picture)
  media.save()
  .then((savedMedia: any) => {
    //console.log('Zdjecie dodane do bazy danych:', savedMedia);
  })
  .catch((error: any) => {
    console.error('Wystąpił błąd podczas zapisywania użytkownika:', error);
  });
  res.send({"status": "OK"});  
})

app.get("/galery", async (req: any, res) => {
  var urls: any = []
  var decoded = req;
  await User.findOne({ uid: decoded.user_id })
  .then(async (document) => {
    for (const fileName of document.media) {
      const options = {
        action: 'read',
        expires: '03-01-2500'  // Ustaw odpowiednią datę wygaśnięcia URL
      };
      const url = await bucket.file(fileName).getSignedUrl(options);
      urls.push(url[0])
    }
  })
  .catch((error) => {
    console.error('Błąd podczas odczytu dokumentu:', error);
    urls = "Blad"
  });

  res.json(JSON.stringify(urls))
})

app.get("/get_profile_config", async (req: any, res) => {
  try {
    const uid = req?.decodedToken.uid;
    const user = await User.findOne({ uid: uid })
    const { username, description, age, gender, _id} = user; // Pobranie pól usera
    const profile_picture = await Media.findOne({ user_id: _id, profile: true })
    const { url } = profile_picture
    res.json({genderDictionary: GenderEnum, username: username, description: description, age: age, gender: gender, url: url}); // Zwraca wynik jako odpowiedź JSON
  } catch (error) {
    console.error('Wystąpił błąd:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania słownika płci' });
  }  
})

app.get("/get_profile_image", async (req: any, res) => {
  try {
    const uid = req?.decodedToken.uid;
    const user = await User.findOne({ uid: uid })
    const profile_media_object = await Media.findOne({ user_id: user._id, profile: true })
    const { url } = profile_media_object
    res.send(url);
  } catch (error) {
    console.error('Wystąpił błąd:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania słownika płci' });
  } 
})

app.post("/update_profile", async (req: any, res) => {
  const { age, gender, description, url_photo_image } = req.body;
  const uid = req?.decodedToken.uid;
  try {
    const filter = { uid: uid }; // Filtruje użytkownika po identyfikatorze
    const update = { age, gender, description }; // Nowe wartości pól do aktualizacji

    await User.updateOne(filter, update); // Aktualizuje jednego użytkownika
    const user = await User.findOne({ uid: req.decodedToken.uid })
    const { _id } = user;
    if(url_photo_image)
      await Media.updateOne({ user_id: _id }, { url: url_photo_image });
    res.json({ message: "Profil użytkownika został zaktualizowany" });
  } catch (error) {
    console.error("Wystąpił błąd:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji profilu użytkownika" });
  }
})

app.post("/post_photo_to_gallery", async (req: any, res) => {//trzeba jeszcze poszukać usera i dopiero tak jak u gory
  const { name, title, fullUrl } = req.body;
  const uid = req.decodedToken.uid;
  try {
    const filter = { uid: uid }; // Filtruje użytkownika po identyfikatorze
    const user = await User.findOne(filter)
    const newMediaEntry = new Media({
      _id: new mongoose.Types.ObjectId(),
      name: name, 
      title: title,
      url: fullUrl,
      user_id: user._id
    })
    await newMediaEntry.save()
    res.send("Posted")
  } catch(error) {
    console.error("Wystapil blad", error)
    res.status(500).json({ error: "Wystapil blad podczas aktualizacji profilu uzytkownika"})
  }
})

app.get("/get_photos_from_gallery", async (req: any, res) => {
  const uid = req.decodedToken.uid
  try {
    console.log("uid w get_photos", uid)
    const filter = { uid: uid }; // Filtruje użytkownika po identyfikatorze
    const user = await User.findOne(filter)
    const { _id } = user;
    const photos = await Media.find({ user_id: _id })
    res.json(photos)
  } catch(error) {
    console.error("wysapil blad", error)
    res.status(500).json({ error: "Wystapil blad podczas aktualizacji profilu uzytkownika"})
  }
})

app.put("/edit_photo_in_gallery", async (req: any, res) => {
  const { _id, name, title, url } = req.body;

  const uid = req.decodedToken.uid;

  try {
    const filterForUser = { uid: uid };
    const user = await User.findOne(filterForUser);

    const filterForPhoto = { _id: _id, user_id: user._id };
    const updatedData = { name, title, url: url };

    const updatedPhoto = await Media.findOneAndUpdate(filterForPhoto, updatedData, { new: true });

    if (!updatedPhoto) {
      return res.status(404).json({ error: "Nie znaleziono odpowiedniego zdjęcia do edycji" });
    }
    console.log("poprawnie zakualizowano zdjecie")
    res.json(updatedPhoto);

  } catch(error) {
    console.error("Wystapil blad", error);
    res.status(500).json({ error: "Wystapil blad podczas edycji zdjęcia w galerii" });
  }
});

app.post("/delete_photo", async (req, res) => {
  //usuwanie z bazy danych Media w którym są przechowywane zdjęcia
  const { profile, url, user_id, _id } = req.body;
  Media.deleteOne({ _id: _id })
  .catch(err => {
    console.log(err)
  })
  res.json({
    "status": "no kurde chyba wszystko git"
  })
})

app.post('/userzy', (req, res) => {
  const userEmail = req.body.email;

  User.find({ email: { $ne: userEmail } })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Błąd podczas pobierania danych z bazy', error);
      res.status(500).send('Wystąpił błąd podczas pobierania danych');
    });
});

app.listen(3000, () => {
  console.log('Serwer nasłuchuje na porcie 3000');
});