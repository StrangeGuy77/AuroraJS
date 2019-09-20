const { Contactmailer, DefaultLocale, userSession } = require("../keys");
const userSessionVerification = require("../helpers/userVerification");

const ctrl = {};

ctrl.index = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let viewModel = {
    title: `${toTranslateJSON.library} - Aurora Development`,
    language: {}
  };
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  res.render("sections/librarySection/libraryIndex", viewModel);
};

ctrl.view = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let viewModel = {
    title: `${toTranslateJSON.library} - Aurora Development`,
    language: {}
  };
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );
  viewModel.session = userProperties;
};

ctrl.create = (req, res) => {
  console.log(req.file);
  res.send("Completado!");
};

ctrl.like = (req, res) => {};

ctrl.comment = (req, res) => {};

ctrl.delete = (req, res) => {};

module.exports = ctrl;
