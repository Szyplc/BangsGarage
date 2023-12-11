"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { User, Chat_room, Conversation, GenderDictionary, Media } = require('./schema.js');
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
//firebase
const app_1 = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = require('./bangsgarage-firebase-adminsdk-o8ms7-ad6dd68035.json');
const uri = 'mongodb+srv://generalkenobi1919:X3AdbUJMjhaCI8RN@cluster0.zcokpld.mongodb.net/Praktyki';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//app.use(bodyParser.json());
let storage, bucket;
function firebase_connection() {
    return __awaiter(this, void 0, void 0, function* () {
        const firebaseConfig = {
            apiKey: "AIzaSyCs-RZVFpzaVgUmq2t58iMCgPW3qHqZkrU",
            authDomain: "bangsgarage.firebaseapp.com",
            projectId: "bangsgarage",
            storageBucket: "bangsgarage.appspot.com",
            messagingSenderId: "926812595227",
            appId: "1:926812595227:web:efb9a53a59ee75f03404be",
            measurementId: "G-QSD5N1NVLE"
        };
        yield firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount)
        });
        yield (0, app_1.initializeApp)(firebaseConfig);
        storage = firebase_admin_1.default.storage();
        bucket = storage.bucket("bangsgarage.appspot.com");
    });
}
function con() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(uri)
            .then(() => {
            console.log("Polaczono z baza danych");
        });
        const db = mongoose_1.default.connection;
        return db;
    });
}
const firebaseAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path != "/register") {
        try {
            const authHeader = req.headers.authorization;
            let authToken;
            if (authHeader)
                authToken = authHeader.split(" ")[1];
            if (!authToken) {
                throw new Error('Brak tokena uwierzytelniającego');
            }
            // Zweryfikuj token uwierzytelniający za pomocą Firebase
            const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(authToken);
            console.log("Zalogowano jako: ", decodedToken.uid);
            req.decodedToken = decodedToken; // Dodaj użytkownika do obiektu żądania
            next(); // Przejdź do następnego middleware lub obsługi żądania
        }
        catch (error) {
            console.error('Błąd uwierzytelniania Firebase. endpoint: ', req.path);
            res.status(401).json({ error: 'Nieprawidłowy token uwierzytelniający' });
        }
    }
    else {
        return next();
    }
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield con();
        db.on('error', console.error.bind(console, 'Błąd połączenia:'));
        const col = db.collection("Praktyki");
        firebase_connection();
    });
}
app.use(firebaseAuthMiddleware);
main();
//Endpoint
app.post('/send_photo', (req, res) => {
    const receivedFilePath = req.body.filePath;
    let url_path = receivedFilePath.split(".appspot.com");
    url_path = url_path[1];
    url_path = url_path.split("?")[0];
    url_path = url_path.split("/")[url_path.split("/").length - 1];
    url_path = url_path.replace('%2F', '/');
    url_path = decodeURI(url_path);
    User.findOneAndUpdate({ uid: req.decodedToken.user_id }, { $push: { media: url_path } })
        .then(() => {
        console.log('Dokument został zaktualizowany');
    })
        .catch((error) => {
        console.error('Błąd podczas aktualizacji dokumentu:', error);
    });
    res.json({ success: true, message: 'Ścieżka została pomyślnie odebrana przez serwer' });
});
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        _id: new mongoose_1.default.Types.ObjectId(),
        username: req.body.username,
        email: req.body.userCredential.user.email,
        uid: req.body.userCredential.user.uid,
        localization: req.body.localization
    };
    console.log(req.body.localization);
    // Tworzenie nowego użytkownika
    const newUser = new User(userData);
    // Zapisywanie użytkownika do bazy danych
    yield newUser.save()
        .then((savedUser) => {
        //console.log('Użytkownik został dodany do bazy danych:', savedUser);
    })
        .catch((error) => {
        console.error('Wystąpił błąd podczas zapisywania użytkownika:', error);
    });
    const image_profile_picture = {
        _id: new mongoose_1.default.Types.ObjectId(),
        user_id: userData._id,
        url: null,
        profile: true
    };
    const media = new Media(image_profile_picture);
    media.save()
        .then((savedMedia) => {
        //console.log('Zdjecie dodane do bazy danych:', savedMedia);
    })
        .catch((error) => {
        console.error('Wystąpił błąd podczas zapisywania użytkownika:', error);
    });
    res.send({ "status": "OK" });
}));
app.get("/galery", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var urls = [];
    var decoded = req;
    yield User.findOne({ uid: decoded.user_id })
        .then((document) => __awaiter(void 0, void 0, void 0, function* () {
        for (const fileName of document.media) {
            const options = {
                action: 'read',
                expires: '03-01-2500' // Ustaw odpowiednią datę wygaśnięcia URL
            };
            const url = yield bucket.file(fileName).getSignedUrl(options);
            urls.push(url[0]);
        }
    }))
        .catch((error) => {
        console.error('Błąd podczas odczytu dokumentu:', error);
        urls = "Blad";
    });
    res.json(JSON.stringify(urls));
}));
app.get("/get_profile_config", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genderDictionary = yield GenderDictionary.find({});
        const uid = req === null || req === void 0 ? void 0 : req.decodedToken.uid;
        const user = yield User.findOne({ uid: uid });
        const { username, description, age, gender, _id } = user; // Pobranie pól usera
        const profile_picture = yield Media.findOne({ user_id: _id });
        const { url } = profile_picture;
        res.json({ genderDictionary: genderDictionary, username: username, description: description, age: age, gender: gender, url: url }); // Zwraca wynik jako odpowiedź JSON
    }
    catch (error) {
        console.error('Wystąpił błąd:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania słownika płci' });
    }
}));
app.post("/update_profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { age, gender, description, url_photo_image } = req.body;
    const uid = req === null || req === void 0 ? void 0 : req.decodedToken.uid;
    try {
        const filter = { uid: uid }; // Filtruje użytkownika po identyfikatorze
        const update = { age, gender, description }; // Nowe wartości pól do aktualizacji
        yield User.updateOne(filter, update); // Aktualizuje jednego użytkownika
        const user = yield User.findOne({ uid: req.decodedToken.uid });
        const { _id } = user;
        if (url_photo_image)
            yield Media.updateOne({ user_id: _id }, { url: url_photo_image });
        res.json({ message: "Profil użytkownika został zaktualizowany" });
    }
    catch (error) {
        console.error("Wystąpił błąd:", error);
        res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji profilu użytkownika" });
    }
}));
app.post("/post_photo_to_gallery", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, title, fullUrl } = req.body;
    const uid = req.decodedToken.uid;
    try {
        const filter = { uid: uid }; // Filtruje użytkownika po identyfikatorze
        const user = yield User.findOne(filter);
        const newMediaEntry = new Media({
            _id: new mongoose_1.default.Types.ObjectId(),
            name: name,
            title: title,
            url: fullUrl,
            user_id: user._id
        });
        yield newMediaEntry.save();
        res.send("Posted");
    }
    catch (error) {
        console.error("Wystapil blad", error);
        res.status(500).json({ error: "Wystapil blad podczas aktualizacji profilu uzytkownika" });
    }
}));
app.get("/get_photos_from_gallery", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.decodedToken.uid;
    try {
        console.log("uid w get_photos", uid);
        const filter = { uid: uid }; // Filtruje użytkownika po identyfikatorze
        const user = yield User.findOne(filter);
        const { _id } = user;
        const photos = yield Media.find({ user_id: _id });
        res.json(photos);
    }
    catch (error) {
        console.error("wysapil blad", error);
        res.status(500).json({ error: "Wystapil blad podczas aktualizacji profilu uzytkownika" });
    }
}));
app.put("/edit_photo_in_gallery", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, title, url } = req.body;
    const uid = req.decodedToken.uid;
    try {
        const filterForUser = { uid: uid };
        const user = yield User.findOne(filterForUser);
        const filterForPhoto = { _id: _id, user_id: user._id };
        const updatedData = { name, title, url: url };
        const updatedPhoto = yield Media.findOneAndUpdate(filterForPhoto, updatedData, { new: true });
        if (!updatedPhoto) {
            return res.status(404).json({ error: "Nie znaleziono odpowiedniego zdjęcia do edycji" });
        }
        console.log("poprawnie zakualizowano zdjecie");
        res.json(updatedPhoto);
    }
    catch (error) {
        console.error("Wystapil blad", error);
        res.status(500).json({ error: "Wystapil blad podczas edycji zdjęcia w galerii" });
    }
}));
app.post("/delete_photo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //usuwanie z bazy danych Media w którym są przechowywane zdjęcia
    const { profile, url, user_id, _id } = req.body;
    Media.deleteOne({ _id: _id })
        .catch(err => {
        console.log(err);
    });
    res.json({
        "status": "no kurde chyba wszystko git"
    });
}));
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
