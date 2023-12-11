const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  uid: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String },
  media: { type: Array }
});

const ChatRoomSchema = new mongoose.Schema({
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

const User = mongoose.model('User', UserSchema);
const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = { User, ChatRoom, Conversation };