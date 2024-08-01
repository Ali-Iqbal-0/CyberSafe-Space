import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reports: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
