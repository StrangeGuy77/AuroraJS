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
  user_role: { type: Number }
});

UserSchema.virtual("userUniqueId").get(function() {
  return this.userId;
});

module.exports = mongoose.model("user", UserSchema);
