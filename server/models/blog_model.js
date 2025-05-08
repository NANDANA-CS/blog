import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  profile_pic: { type: String, required: true },
  blog: [{ type: String }],
  description: { type: String, required: true },
  username: { type: String, required: true },
  userid: { type: String, required: true },
  title: { type: String, required: true}
});

export default mongoose.model.Blogs || mongoose.model("Blogs", BlogSchema);