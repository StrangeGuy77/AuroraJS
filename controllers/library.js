const ctrl = {};

ctrl.index = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let viewModel = { title: "Biblioteca - Aurora Development", language: {} };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  res.render("sections/librarySection/libraryIndex", viewModel);
};

ctrl.create = (req, res) => {
  console.log(req.file);
  res.send("Completado!");
};

ctrl.like = (req, res) => {};

ctrl.comment = (req, res) => {};

ctrl.delete = (req, res) => {};

module.exports = ctrl;
