import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profile_pic: { type: String,default:null },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp:{type:String,default:null}
});

export default mongoose.model("Users", userSchema);


