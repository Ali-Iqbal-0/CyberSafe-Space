// models/FriendRequest.js
import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'pending' }, // Can be 'pending', 'accepted', 'rejected'
});

const FriendRequestModel = mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequestModel;
