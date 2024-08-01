import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
}, { timestamps: true });

const CommentReport = mongoose.model('CommentReport', reportSchema);
export default CommentReport;
