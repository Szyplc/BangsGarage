"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GenderEnum = {
    MALE: 'male',
    FEMALE: 'female',
    NON_BINARY: 'non-binary',
    OTHER: 'other'
};
const User_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    uid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    description: { type: String },
    age: { type: Number },
    localization: { type: [Number] },
    connection_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Connections' },
    connversation_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Conversations' },
    gender: { type: String, enum: Object.values(GenderEnum) },
    profile_photo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Media" },
    cars_id: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Cars" }]
}, { timestamps: true });
const Car_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    Car_Specification: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Car_Specification" },
    likes_count: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    media: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Media" }]
}, { timestamps: true });
//Specifykacja auta silnik rocznik liczba drzwi itp. 
const Car_Specification_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    engineInfo: { type: String, required: false },
    version: { type: String, required: false },
    mileage: { type: Number, required: false }
    //na razie tyle
}, { timestamps: true });
//Media jako pojedyncze zdjęcie możliwośc korzystania w poście od auta jako zdjęcie profilowe użytkownika
const Media_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    url: { type: String, required: true },
    views: { type: Number },
    //gdy profile false
    car_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Car" },
    //Gdy jest to zdjęcie profillowe user id nie jest null i profile true
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    profile: { type: Boolean },
    title: { type: String },
}, { timestamps: true });
const Likes_schema = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    user_liked_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    car_liking: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Car' },
    //like_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Likes_type' },
    //date_time: { type: Date, default: Date.now },
}, { timestamps: true });
// const Like_type = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   name: { type: String }
// }, { timestamps: true })
// const Comment = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   user_comment: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   car_commented: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
//   content: { type: String, required: true }
// }, { timestamps: true})
// //na później/////////////////////////////
// const Connections = new mongoose.Schema({
//   id: mongoose.Schema.Types.ObjectId,
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//   date_time: { type: Date, default: Date.now },
//   interaction_time: { type: Number }//
// })
// const Account_type = new mongoose.Schema({
//   id: mongoose.Schema.Types.ObjectId,
//   name: { type: String },
//   price: { type: Number },
// });
const Chat_room_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    name: { type: String, required: true },
    users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }]
});
const Conversation_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    _id_chat_room: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'ChatRoom' },
    messages: [{
            sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        }],
});
const User = mongoose_1.default.model('User', User_schema);
const Chat_room = mongoose_1.default.model('ChatRoom', Chat_room_schema);
const Conversation = mongoose_1.default.model('Conversation', Conversation_schema);
const Media = mongoose_1.default.model('Media', Media_schema);
const Car = mongoose_1.default.model("Car", Car_schema);
const Car_Specification = mongoose_1.default.model("Car_Specification", Car_Specification_schema);
const Likes = mongoose_1.default.model("Likes", Likes_schema);
module.exports = { User, Chat_room, Conversation, Media, GenderEnum, Car, Car_Specification, Likes /*, Media, Account_type, Connections, Like_type*/ };
