const path = require("path");
const helper = require("../helpers/libs");
const fs = require("fs-extra");
const { software } = require("../models/index");

const ctrl = {
  
};

ctrl.index = (req, res) => {};

ctrl.create = async (req, res) => {
  let url, result;
  do {
    url = helper.randomName();
    result = await software.find({ filename: url });
  } while (result > 0);
  const imageTempPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const targetPath = path.resolve(`src/public/upload/${url}${ext}`);
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif") {
    await fs.rename(imageTempPath, targetPath);
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
    console.log(file);
    res.redirect("/");
  } else {
    await fs.unlink(imageTempPath);
    res.render("partials/errors/error500", {reason: `Huh, al parecer hubo un error al subir el archivo, intenta de nuevo y asegúrate de subir un archivo correcto.
    Si esto persiste, contacta a un administrador.`});
  }
};

ctrl.like = (req, res) => {};

ctrl.comment = (req, res) => {};

ctrl.delete = (req, res) => {};

module.exports = ctrl;
