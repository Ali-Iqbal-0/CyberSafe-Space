import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  image: { type: String, trim: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  anonymous: {type: Boolean, default: false,},
});

const Post = mongoose.model('Post', postSchema);

export default Post;
