import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  profilePic: { type: String, required: true }, // Add profilePic field for storing image path
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
