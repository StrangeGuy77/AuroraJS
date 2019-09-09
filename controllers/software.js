const path = require("path");
const helper = require("../helpers/libs");
const fs = require("fs-extra");
const { software, comment } = require("../models/index");
const md5 = require("md5");
const sidebar = require('../helpers/sidebar');

const ctrl = {};

ctrl.index = async (req, res) => {
  let translation = require('../locales/de');
  
  const softwares = await software.find().sort({ timestamp: -1 });
  let viewModel = {softs: [], title: "Software - Aurora Development", language: {}};
  viewModel.language = JSON.parse(translation);
  viewModel.softs = softwares;
  viewModel = await sidebar(viewModel);
  res.render("softwareIndex", viewModel);
}

ctrl.view = async (req, res) => {
  let translation = require('../locales/de');
  let viewModel = { soft: {}, comments: {}, language: {}};

  const soft = await software.findOne({
    filename: { $regex: req.params.software_id }
  });
  if (soft) {
    soft.views = soft.views + 1;
    viewModel.soft = soft;
    await soft.save();
    const comments = await comment.find({ soft_id: soft._id });
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    res.render("software", viewModel);
  } else {
    res.redirect("/");
  }
};

ctrl.create = async (req, res) => {

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
      filename: url + ext
    });

    const savedFile = await file.save().catch(reason => {
      console.log(`Error: ${reason}`);
    });

    res.redirect("/");

  } else {
    // Not correct image extension? unlink from marked path before.
    await fs.unlink(imageTempPath);
    res.render("partials/errors/error500", {
      reason: `Huh, al parecer hubo un error al subir el archivo, intenta de nuevo y asegúrate de subir un archivo correcto.
    Si esto persiste, contacta a un administrador.`
    });
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
    res.render('partials/errors/error504', {reason: "Ha ocurrido un error interno del servidor"});
  }

};

ctrl.comment = async (req, res) => {
  console.log(req.body);
  const soft = await software.findOne({
    filename: { $regex: req.params.software_id }
  });
  if (soft) {
    const newComment = new comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.soft_id = soft._id;
    await newComment.save();
    res.redirect(`/software/${soft.uniqueId}`);
  } else {
    res.render("partials/errors/error504", {
      reason:
        "Ha habido un problema al publicar el comentario, por favor inténtelo una vez más"
    });
  }
};

ctrl.delete = async (req, res) => {
  const soft = await software.findOne({
    filename: { $regex: req.params.software_id }
  });

  if (soft) {
    await fs.unlink(path.resolve(`./src/public/upload/${soft.filename}`));
    await comment.deleteOne({soft_id: soft._id});
    await soft.remove();
    res.redirect('/software');
  } else {
    res.render('partials/errors/error504', {
      reason:
        "Ha habido un problema al eliminar la imagen, por favor inténtelo una vez más"
    });
  }

};

module.exports = ctrl;
