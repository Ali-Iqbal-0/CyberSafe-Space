import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const CertificationFileSchema = new mongoose.Schema({
  path: { type: String, required: true },
});

const CertificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  degree: { type: String, required: true },
  certifications: [CertificationFileSchema],
  availability: [AvailabilitySchema],
});

const CertificationModel = mongoose.model("Certification", CertificationSchema);

export default CertificationModel;
