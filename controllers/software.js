const path = require("path");
const helper = require("../helpers/libs");
const fs = require("fs-extra");
const { software, comment } = require("../models/index");
const md5 = require("md5");
const sidebar = require('../helpers/sidebar');
const { DefaultLocale } = require('../keys');
 
const ctrl = {};

ctrl.index = async (req, res) => {

  // First of all load the JSON where's the language to translate the page
  let CurrentLanguage = req.params.language;
  let toTranslateJSON = require(`../locales/${CurrentLanguage}.json`);
  
  // Search & load 'softwares' with the search of softwares within the MongoDB database
  const softwares = await software.find().sort({ timestamp: -1 });

  // Load viewModel with an array for softwares and title.
  let viewModel = {softs: [], title: "Software - Aurora Development"};
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = CurrentLanguage;
  viewModel.softs = softwares;

  // Reassign preferedLanguage to the current selected language.
  DefaultLocale.preferedUserLanguage = CurrentLanguage;

  // Load sidebar with data from db then render it.
  viewModel = await sidebar(viewModel);
  res.render("sections/softwareSection/softwareIndex", viewModel);
}

ctrl.view = async (req, res) => {

  let CurrentLanguage = req.params.language;
  let toTranslateJSON = require(`../locales/${CurrentLanguage}.json`);

  let viewModel = { soft: {}, comments: {}, language: {}, title: "Software - Aurora Development"};
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = CurrentLanguage
  
  // Software which will be rendered.
  let softwareToFind = req.params.software_id

  const soft = await software.findOne({
    filename: { $regex: softwareToFind }
  });

  // Increase software views whenever page is loaded.
  if (soft) {
    soft.views = soft.views + 1;
    viewModel.soft = soft;
    viewModel.soft.CurrentLanguage = req.params.language
    await soft.save();
    const comments = await comment.find({ soft_id: soft._id });
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    res.render("sections/softwareSection/softwareView", viewModel);
  } else {
    res.redirect(`/${req.params.language}`);
  }
};

ctrl.create = async (req, res) => {

  let CurrentLanguage = req.params.language

  // Verification for duplicated softwares within database before renaming one
  let url, result;
  do {
    url = helper.randomName();
    result = await software.find({ filename: url });
  } while (result > 0);

  // Linking the path where to save the software preview image && resolving extensions
  const imageTempPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const targetPath = path.resolve(`src/public/upload/${url}${ext}`);

  // Verifying software preview image extensions
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif") {
    // Therefore filesystem can rename images with their final name within db
    await fs.rename(imageTempPath, targetPath);
    // Model instance
    const file = new software({
      title: req.body.title,
      description: req.body.description,
      princLanguage: req.body.language,
      price: req.body.price.trim() !== "" ? parseInt(req.body.price) : 0,
      placeFromUploaded: req.params.language,
      filename: url + ext
    });
    
    const savedFile = await file.save().catch(reason => {
      console.log(`Error: ${reason}`);
    });

    res.redirect(`/${CurrentLanguage}/software`);

  } else {
    // Not correct image extension? unlink from marked path before.
    await fs.unlink(imageTempPath);
    res.render("partials/errors/error500");
  }
};

ctrl.like = async (req, res) => {

  // Search for the software where to mark the new like from the params.
  const soft = await software.findOne({
    filename: { $regex: req.params.software_id }
  });

  if (soft) {
    soft.likes = soft.likes + 1;
    await soft.save();
    res.json({ likes: soft.likes });
  } else {
    res.render('partials/errors/error504');
  }

};

ctrl.comment = async (req, res) => {

  // Search for software where to share the comment
  const soft = await software.findOne({
    filename: { $regex: req.params.software_id }
  });

  // If the software exists, save comment, set a random gravatar image and redirect to the same page.
  if (soft) {
    const newComment = new comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.soft_id = soft._id;
    await newComment.save();
    res.redirect(`/${req.params.language}/software/${soft.uniqueId}`);
  } else {
    res.render("partials/errors/error504");
  }
};

ctrl.delete = async (req, res) => {

  // Find the software to delete
  const soft = await software.findOne({
    filename: { $regex: req.params.software_id }
  });

  // If found, unlink it from anywhere it could be within the server or database, including its comments.
  if (soft) {
    await fs.unlink(path.resolve(`./src/public/upload/${soft.filename}`));
    await comment.deleteOne({soft_id: soft._id});
    await soft.remove();
    res.redirect(`/${req.params.language}/software`);
  } else {
    res.render('partials/errors/error504');
  }

};

module.exports = ctrl;
