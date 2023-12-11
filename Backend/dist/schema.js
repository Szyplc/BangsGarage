"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    uid: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    media_id: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: 'Media' },
    description: { type: String },
    account_type: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Account_type' },
    age: { type: Number },
    expirationAccount: { type: Date, default: new Date().setFullYear(new Date().getFullYear() + 3) },
    Elo: { type: Number },
    localization: { type: [Number] },
    connection_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Connections' },
    likes_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Likes' },
    connversation_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Conversations' },
    gender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'GenderDictionary' },
    gender_search: {},
    profile_photo: { type: String },
});
const gender_schema = new mongoose_1.default.Schema({
    code: { type: String },
    name: { type: String }
});
const GenderDictionary = mongoose_1.default.model('GenderDictionary', gender_schema);
/*const male = { code: 'M', name: 'Mężczyzna' };
const female = { code: 'F', name: 'Kobieta' };
const notDefined = { code: 'N', name: 'Nieokreślona' }
const Male = new GenderDictionary(male);
const Female = new GenderDictionary(female);
const NotDefined = new GenderDictionary(notDefined);
Male.save();
Female.save();
NotDefined.save();*/
const Likes = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    user_liked_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    user_likeing_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    like_type_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Likes_type' },
    date_time: { type: Date, default: Date.now },
    interaction_time: { type: Number } //
});
const Like_type = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    name: { type: String }
});
const Connections = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    date_time: { type: Date, default: Date.now },
    interaction_time: { type: Number } //
});
const Account_type = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    name: { type: String },
    price: { type: Number },
});
const Media_schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    url: { type: String },
    timeSpent: {}, //
    interaction: {}, //
    views: { type: Number },
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    profile: { type: Boolean },
    title: { type: String }
});
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
module.exports = { User, Chat_room, Conversation, GenderDictionary, Media /*, Media, Account_type, Connections, Like_type, Likes*/ };
