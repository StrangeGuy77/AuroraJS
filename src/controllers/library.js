const { Contactmailer, DefaultLocale, userSession } = require("../keys");
const userSessionVerification = require("../helpers/userVerification");
const helper = require("../helpers/libs");

const ctrl = {};

ctrl.index = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.sectionsInfo.library} - Aurora Development`;
  res.render("sections/librarySection/libraryIndex", viewModel);
};

ctrl.bookView = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.sectionsInfo.library} - Aurora Development`;
  res.render("sections/librarySection/bookView", viewModel);
};

ctrl.bookUploadView = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.sectionsInfo.library} - Aurora Development`;
  res.render("sections/librarySection/bookUpload", viewModel);
};

ctrl.bookUploadProcess = async (req, res) => {
  res.send("works!");
};

ctrl.bookDelete = async (req, res) => {
  res.send("works!");
};

ctrl.bookLike = async (req, res) => {
  res.send("works!");
};

ctrl.bookComment = async (req, res) => {
  res.send("works!");
};

ctrl.courseView = async (req, res) => {
  res.send("works!");
};

ctrl.courseUploadView = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.sectionsInfo.courses} - Aurora Development`;
  res.render("sections/librarySection/courseUpload", viewModel);
};

ctrl.courseUploadProcess = async (req, res) => {
  res.send("works!");
};

ctrl.courseDelete = async (req, res) => {
  res.send("works!");
};

ctrl.courseLike = async (req, res) => {
  res.send("works!");
};

ctrl.courseComment = async (req, res) => {
  res.send("works!");
};

ctrl.wishlistAdd = async (req, res) => {
  res.send("works!");
};

module.exports = ctrl;
