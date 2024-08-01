// Report.js (or any appropriate file for your models)

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Assuming your Post model is named 'Post'
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your User model is named 'User'
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
