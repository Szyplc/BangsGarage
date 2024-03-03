const { User, Media, GenderEnum, Car, Car_Specification, Likes } = require('./schema.js');
import mongoose from 'mongoose';
import cors from "cors"
import express from 'express';
//firebase
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import admin from 'firebase-admin';
import { User } from 'firebase/auth';
import { CarData, Car_Specification, Media } from "./../../types/types"
import "dotenv/config.js"
const serviceAccount = require('./bangsgarage-firebase-adminsdk-o8ms7-ad6dd68035.json');
const uri = 'mongodb+srv://generalkenobi1919:X3AdbUJMjhaCI8RN@cluster0.zcokpld.mongodb.net/Praktyki';
const app = express();
app.use(express.json());
app.use(cors());
//app.use(bodyParser.json());

declare module 'express-serve-static-core' {
  interface Request {
    decodedToken?: { [key: string]: any }; // Zdefiniuj typ decodedToken zgodnie z tym, co faktycznie oczekujesz
  }
}

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
    localization: req.body?.localization
  };
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
  let savedMedia = await media.save()
  .catch((error: any) => {
    console.error('Wystąpił błąd podczas zapisywania użytkownika:', error);
  });
  
  await User.updateOne({ uid: req.body.userCredential.user.uid }, { $set: { profile_photo: savedMedia._id }})
  
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

app.get("/user", async (req: any, res) => {
  try {
    const uid = req?.decodedToken.uid;
    const user = await User.findOne({ uid: uid })
    const {
      username = "",
      description = "",
      age = 0,
      gender = "",
      _id = ""
    } = user || {}; // Pobranie pól usera
    const profile_picture = await Media.findOne({ user_id: _id, profile: true })
    const { url } = profile_picture ? profile_picture : ""
    res.json({genderDictionary: GenderEnum, username: username, description: description, age: age, gender: gender, url: url}); // Zwraca wynik jako odpowiedź JSON
  } catch (error) {
    console.error('Wystąpił błąd:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania słownika płci' });
  }  
})

app.get("/profile_image", async (req: any, res) => {
  try {
    const uid = req?.decodedToken.uid;
    const user = await User.findOne({ uid: uid })
    console.log(user)
    const profile_media_object = await Media.findOne({ user_id: user._id, profile: true }) as Media | null
    let url = ""
    if(profile_media_object?.url != undefined)
      url = profile_media_object.url
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
    console.log(uid)
    const user = await User.findOne({ uid: uid })
    const { _id } = user;
    console.log("url: ", url_photo_image)
    if(url_photo_image)
      await Media.updateOne({ user_id: _id }, { url: url_photo_image, profile: true });
    res.json({ message: "Profil użytkownika został zaktualizowany" });
  } catch (error) {
    console.error("Wystąpił błąd:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji profilu użytkownika" });
  }
})

app.post("/post_photo_to_gallery", async (req: any, res) => {//trzeba jeszcze poszukać usera i dopiero tak jak u gory
  const { name, title, fullUrl, profile, carId } = req.body;
  if(typeof name == 'string' && typeof title == 'string' && typeof fullUrl == 'string' && typeof profile == 'boolean') {
    const uid = req.decodedToken.uid;
    try {
      const filter = { uid: uid }; // Filtruje użytkownika po identyfikatorze
      const user = await User.findOne(filter)
      const newMediaEntry = new Media({
        _id: new mongoose.Types.ObjectId(),
        name: name, 
        title: title,
        url: fullUrl,
        profile: profile,
        user_id: user._id,
        car_id: carId
      })
      await newMediaEntry.save()
      await Car.findByIdAndUpdate(carId, { $push: { media: newMediaEntry._id } })

      res.send("Posted")
    } catch(error) {
      console.error("Wystapil blad", error)
      res.status(500).json({ error: "Wystapil blad podczas aktualizacji profilu uzytkownika"})
    }
  } else res.status(500).json({ error: "Podaj poprawne dane!" })
})

app.get("/get_photos_from_gallery", async (req: any, res) => {
  const uid = req.decodedToken.uid
  try {
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

app.delete("/delete_photo", async (req, res) => {
  const _id  = req?.body?._id;
  console.log("delete endpoint")
  console.log(_id)
  
  try {
    if(_id) {
      await Media.deleteOne({ _id: _id });
      
      res.json({
        "status": "noo kurde chyba wszystko git"
      });
    }
    else 
      res.status(500).json({ status: "Error" })
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ status: "Error", message: err.message });
  }
})

app.delete("/delete_car_media", async (req, res) => {
  const _car_id: string = req.body._car_id;

  try {
    if (_car_id) {
      // Znajdź wszystkie Media, które mają car_id równy _car_id i profile ustawione na true
      const mediaToDelete: Array<{ _id: mongoose.Types.ObjectId }> = await Media.find({ car_id: _car_id, profile: true }).select('_id').lean();

      if (mediaToDelete.length > 0) {
        const mediaIdsToDelete: mongoose.Types.ObjectId[] = mediaToDelete.map(media => media._id);
        await Media.deleteMany({ _id: { $in: mediaIdsToDelete } });

        // Zaktualizuj Car, usuwając referencje do usuniętych mediów
        await Car.updateOne({ _id: _car_id }, { $pull: { media: { $in: mediaIdsToDelete } } });

        res.json({ "status": "ok" });
      } else {
        // Nie znaleziono mediów do usunięcia
        res.json({ "status": "no media found to delete" });
      }
    } else {
      res.json({ "status": "not ok" });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).send({ "error": err.message });
  }
})

app.delete("/delete_car",async (req, res) => {
  const _id = req?.body?._id;
  try {
    if(_id) {
      let car = await Car.find({ _id: _id })
      if(car) {
        await Car_Specification.deleteOne({ Car_Specification: car.Car_Specification })
        await Car.deleteOne({ _id: _id })
        res.json({ "status" : "OK" })
      } else {
        res.status(404).json({ "status" : "Error" })
      }
    } 
  }catch (err) {
    res.send(err)
  }
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

app.post("/create_car", async (req: any, res) => {
  try {
    const car_specification = new Car_Specification({
      _id: new mongoose.Types.ObjectId(),
      manufacturer: "creating",
      model: "creating",
      year: 0
    })
    const saved_Car_Specyfication = await car_specification.save();
    const car_specification_Id = saved_Car_Specyfication._id;
    console.log(car_specification_Id)
    //Znajdujemy usera
    const user = await User.findOne({ uid: req.decodedToken.user_id })
    const { _id } = user

  //Wstawiamy objekt car do bazy
    const newCarEntry = new Car({
      _id: new mongoose.Types.ObjectId(),
      user_id: _id,
      Car_Specification: car_specification_Id,
      likes_count: 0,
      views: 0,
      //meida jako pojedyncze zdjęcie profilowe(główne) auta
    })
    await newCarEntry.save()
    res.send(newCarEntry)
  } catch(error) {
    console.error("Wystapil blad", error)
    res.send(error)
  }
})

app.put("/update_car", async (req: any, res) => {
  const {
    manufacturer,
    model,
    year,
    engineInfo,
    version,
    mileage,
    carId
} = req.body;

  if(carId == "")
    res.status(400).send({ error: "CarId is empty." })

  const car = await Car.findOne({ _id: carId })
  const car_spec_id = car.Car_Specification;
   
  try { 
  
    const updateData: Car_Specification = {
      manufacturer: '',
      model: '',
      year: 0,
      engineInfo: '',
      version: '',
      mileage: 0,
    };
    
    if (manufacturer !== undefined && typeof manufacturer == 'string') updateData.manufacturer = manufacturer;
    if (model !== undefined && typeof manufacturer == 'string') updateData.model = model;
    if (year !== undefined) updateData.year = year;
    if (engineInfo !== undefined && typeof manufacturer == 'string') updateData.engineInfo = engineInfo;
    if (version !== undefined && typeof manufacturer == 'string') updateData.version = version;
    //if (image !== undefined) updateData.image = image;
    if (mileage !== undefined) updateData.mileage = mileage;

    await Car_Specification.findByIdAndUpdate(car_spec_id, updateData, { new: true });
  } catch(error) {
    console.error("Wystapil blad", error)
  }
  res.json({"status": "OK"})
})

app.put("/updateCarMedia", async (req, res) => {
  const { image, carId, profile } = req.body;

  // Sprawdzanie podstawowej walidacji dla image i carId
  if (!image || !carId) {
    return res.status(400).send({ message: "Image i carId są wymagane." });
  }

  // Dodatkowo, możesz sprawdzić czy carId istnieje w bazie danych
  const car = await Car.findOne({ _id: carId });
  if (!car) {
    return res.status(404).send({ message: "Nie znaleziono samochodu o podanym carId." });
  }

  // Tworzenie nowego obiektu Media
  const newMedia = new Media({
    _id: new mongoose.Types.ObjectId(),
    url: image,
    views: 0,
    car_id: carId,
    profile: profile === null || profile === undefined ? false : profile, // Ustawienie domyślnej wartości na false, jeśli profile jest null lub undefined
  });

  let media = await newMedia.save();

  // Aktualizacja tablicy media w dokumencie car
  car.media.push(media._id);
  await Car.findByIdAndUpdate(carId, { media: car.media });

  // Wysyłanie zaktualizowanego dokumentu car jako odpowiedź
  res.send(await Car.findOne({ _id: carId }).populate('Car_Specification').populate('media'));

})

app.get("/getUserCars", async (req: any, res) => {
  const user = req.decodedToken
  const user_db = await User.findOne({ uid: user.user_id })
  console.log(user.user_id)
  const cars = await Car.find({ 
    user_id: user_db._id
  })
  .populate({
    path: "Car_Specification",
    match: { manufacturer: { $ne: 'creating'} }
  })
  .sort({ createdAd: 1 })

  const filteredCars = cars.filter(car => car.Car_Specification);

  const carIds = filteredCars.map(car => car._id);
  res.send(carIds)
})

app.get("/getCarData", async (req, res) => {
  const { car_id } = req.query;
  const car = await Car.findOne({ _id: car_id }).populate('Car_Specification').populate('media')
  res.send(car)
})

app.get("/getCarToSlider", async (req, res) => {
  const indexToConvert = req?.query?.index; // Pobierz indeks z ciała żądania
  const index = parseInt(typeof indexToConvert == 'string' ? indexToConvert : "-1")
  if (index < 0) {
    return res.status(400).send({ message: "Nieprawidłowy index, powinien być liczbą większą od 0." });
  }

  try {
    // Znajdź wszystkie samochody, posortuj je malejąco według liczby polubień
    const cars = await Car.find({ "media.0": { $exists: true } })//.sort({ likes_count: -1 })
    .populate('Car_Specification')
    .populate('media')
    .exec();
    // Wybierz samochód na pozycji index-1 (ponieważ tablice są indeksowane od 0)
    
    const carRate: number[] = []
    //user localization
    const userToken = req.decodedToken
    const user = await User.findOne({ uid: userToken?.user_id })
    const [userLat, userLon] = user.localization ? user.localization : [0, 0]

    for(const car of cars) {
      //oblicanie ile to polubienia
      let likesRate;
      if(car.views <= 0)
        likesRate = 0.0001;
      else
        likesRate = (car.likes_count + 1) / car.views
      //właścicel auta i jego lokalizacja oraz czy dane auto nie należy do przeglądającego auto
      const car_owner_id = car.user_id;
      if(car_owner_id == user._id)
        continue
      const currentUser = await User.findById(car_owner_id)
      const [currentUserLat, currentUserLon] = currentUser?.localization ? currentUser.localization : [0, 0]
      //obliczanie jak daleko
      let distance = calculateDistance(userLat, userLon,  currentUserLat, currentUserLon) + 1;
      const radius = 500; // promień w którym szukamy aut
      distance = distance / radius
      //calculating time in hours
      const givenDate: Date = new Date(car.createdAt);
      const currentDate: Date = new Date();
      const differenceInHours: number = (currentDate.getTime() - givenDate.getTime()) / 1000 / 60 / 60 + 0.0001;
      //likesRate - more better
      //distance - lower better
      //differenceInHours - lower better
      const result = likesRate / (distance * differenceInHours) * 1000
      carRate.push(result)
    }
    //sort
    let combined = cars.map((car, i) => [car,  carRate[i]]);
    combined = combined.sort((a, b) => b[1] - a[1]);

    const carAtIndex = combined[index][0];

    if (!carAtIndex) {
      return res.send(null)
      //return res.status(404).send({ message: "Nie znaleziono samochodu na podanym indeksie." });
    }

    // Zwróć znaleziony samochód
    res.send(await carAtIndex);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Wystąpił błąd podczas wyszukiwania samochodu." });
  }
})

app.post("/toggle_like_to_car", async (req, res): Promise<void> => {
  const userId: string = req.decodedToken?.user_id;
  const carId: string = req?.body?.carId;
  try {
    // Znajdź użytkownika w bazie danych
    const user_db = await User.findOne({ uid: userId });
    if (!user_db) {
      res.status(404).send({ message: "Nie znaleziono użytkownika." });
      return;
    }

    const car: CarData | null = await Car.findOne({ _id: carId })
    
    if (!car) {
      res.status(404).send({ message: "Nie znaleziono samochodu." });
      return;
    }
    //Sprawdź czy like jest już dodany
    const isLike = await Likes.find({ user_liked_id: user_db._id, car_liking: car._id })
    if(isLike?.length == 0) {
      console.log(car._id)
      // Stwórz dokument Like
      const newLike = new Likes({
        _id: new mongoose.Types.ObjectId(),
        user_liked_id: user_db._id,
        car_liking: car._id,
      });
      await Car.findByIdAndUpdate(carId, { $inc: { likes_count: 1 } }, { new: true });///////////////
    
      await newLike.save();
      res.json({ message: "Lajk dodany.", inc: 1 });
    } else {
      await Likes.deleteOne({ user_liked_id: user_db._id, car_liking: car._id })
      await Car.findByIdAndUpdate(carId, { $inc: { likes_count: -1 } }, { new: true });
      res.json({ message: "lajk odjety", inc: -1 })
    }

  } catch (err: any) {
    console.error(err);
    res.status(500).send({ message: "Wystąpił błąd.", error: err.message });
  }
})

app.get("/check_if_user_like_car", async (req, res) => {
  const userId: string = req.decodedToken?.user_id;
  const carId: string = req?.query?.carId as string;
  if(typeof carId == 'string' && typeof userId == 'string') {
    try {
      const user = await User.findOne({ uid: userId })
      await Car.findOneAndUpdate({ _id: carId}, { $inc:  { views: 1 } })

      const isLike = await Likes.find({ user_liked_id: user?._id, car_liking: carId })
      if (isLike?.length > 0)
        res.send(true)
      else 
        res.send(false)
    } catch (err: any) {
      console.error(err)
      res.status(500).send({ message: "Wystapil blad", err: err.message})
    }
  }
})

app.get("/get_liked_cars", async (req, res) => {
  const userId: string = req.decodedToken?.user_id
  try {
    if(typeof userId == 'string') {
      const user = await User.findOne({ uid: userId })
      const likes = await Likes.find({ user_liked_id: user?._id })
      const arrayOfCarId: string[] = likes.map(obj => obj.car_liking)
      res.send(arrayOfCarId)
    }
  } catch (err) {
    
  }
})

app.listen(3000, () => {
  console.log('Serwer nasłuchuje na porcie 3000');
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Promień Ziemi w kilometrach
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Dystans w kilometrach
  return distance;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
