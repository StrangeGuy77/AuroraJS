const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userId: { type: Number },
  username: { type: String },
  password: { type: String },
  user_email: { type: String },
  user_registered_date: { type: Date, default: Date.now },
  user_activation_key: { type: Number },
  user_status: { type: Number },
  user_role: { type: Number },
  profile_pic: { type: String, default: "" },
  name: { type: String, default: "" },
  lastname: { type: String, default: "" },
  cellphone: { type: String, default: "" },
  worksite: { type: String, default: "" },
  enterprise: { type: String, default: "" },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  github: { type: String, default: "" },
  webpage: { type: String, default: "" },
  show_public_name: { type: Boolean, default: false },
  show_public_email: { type: Boolean, default: false },
  show_public_location: { type: Boolean, default: false },
  followers: { type: Number, default: 0 },
  times_liked: { type: Number, default: 0 },
  times_posted: { type: Number, default: 0 },
  software_collection: { type: Array, default: [] },
  book_collection: { type: Array, default: [] },
  payment_collection: { type: Array, default: [] },
  courses_collection: { type: Array, default: [] },
  wishlist: { type: Array, default: [] }
});

UserSchema.virtual("userUniqueId").get(function() {
  return this._id;
});

module.exports = mongoose.model("user", UserSchema);
