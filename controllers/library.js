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
  viewModel.session.username = userSession.username;
  res.render("sections/librarySection/libraryIndex", viewModel);
};

ctrl.bookView = (req, res) => {
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
  viewModel.session.username = userSession.username;
  res.render("sections/librarySection/bookView", viewModel);
};

ctrl.bookUploadView = async (req, res) => {
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
  viewModel.session.username = userSession.username;
  res.render("sections/librarySection/bookUpload", viewModel);
};

ctrl.bookUploadProcess = async (req, res) => {};

ctrl.bookDelete = async (req, res) => {};

ctrl.bookLike = async (req, res) => {};

ctrl.bookComment = async (req, res) => {};

ctrl.courseView = async (req, res) => {};

ctrl.courseUploadView = async (req, res) => {
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
  viewModel.session.username = userSession.username;
  res.render("sections/librarySection/bookUpload", viewModel);
};

ctrl.courseUploadProcess = async (req, res) => {};

ctrl.courseDelete = async (req, res) => {};

ctrl.courseLike = async (req, res) => {};

ctrl.courseComment = async (req, res) => {};

ctrl.wishlistAdd = async (req, res) => {};

module.exports = ctrl;
