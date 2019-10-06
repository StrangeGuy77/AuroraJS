const path = require("path");
const mongoose = require("mongoose");
const helper = require("../helpers/libs");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String },
  id: { type: Number, default: helper.randomId() },
  description: { type: String },
  author: { type: String },
  price: { type: Number, default: 0 },
  extension: { type: String, default: ".pdf" },
  weight: { type: Number, default: 0 },
  publisher: { type: String, default: "" },
  publisherYear: { type: Date, default: Date.now },
  writingYear: { type: Date, default: Date.now },
  categories: { type: Array, default: [] },
  filename: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  timesDownloaded: { type: Number, default: 0 },
  userUploaderId: { type: Number, default: 0 },
  userUploaderName: { type: String, default: "defaultUsername" },
  timestamp: { type: Date, default: Date.now }
});

bookSchema.virtual("uniqueId").get(function() {
  return this.filename.replace(path.extname(this.filename), "");
});

module.exports = mongoose.model("book", bookSchema);
