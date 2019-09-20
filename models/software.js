const path = require("path");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const SoftwareSchema = new Schema({
  title: { type: String },
  description: { type: String },
  princLanguage: { type: String },
  price: { type: Number, default: 0 },
  filename: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  timesDownloaded: { type: Number, default: 0 },
  userUploaderId: { type: Number, default: 0 },
  userUploaderName: { type: String, default: "defaultUsername" },
  timestamp: { type: Date, default: Date.now }
});

SoftwareSchema.virtual("uniqueId").get(function() {
  return this.filename.replace(path.extname(this.filename), "");
});

module.exports = mongoose.model("software", SoftwareSchema);
