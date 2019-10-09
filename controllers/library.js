const { Contactmailer, DefaultLocale, userSession } = require("../keys");
const userSessionVerification = require("../helpers/userVerification");
const helper = require("../helpers/libs");

const ctrl = {};

ctrl.index = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language);
  viewModel.title = `Error 403 - Aurora Development`;
  res.render("sections/librarySection/libraryIndex", viewModel);
};

ctrl.bookView = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language);
  viewModel.title = `Error 403 - Aurora Development`;
  res.render("sections/librarySection/bookView", viewModel);
};

ctrl.bookUploadView = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language);
  viewModel.title = `Error 403 - Aurora Development`;
  res.render("sections/librarySection/bookUpload", viewModel);
};

ctrl.bookUploadProcess = async (req, res) => {};

ctrl.bookDelete = async (req, res) => {};

ctrl.bookLike = async (req, res) => {};

ctrl.bookComment = async (req, res) => {};

ctrl.courseView = async (req, res) => {};

ctrl.courseUploadView = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language);
  viewModel.title = `Error 403 - Aurora Development`;
  res.render("sections/librarySection/bookUpload", viewModel);
};

ctrl.courseUploadProcess = async (req, res) => {};

ctrl.courseDelete = async (req, res) => {};

ctrl.courseLike = async (req, res) => {};

ctrl.courseComment = async (req, res) => {};

ctrl.wishlistAdd = async (req, res) => {};

module.exports = ctrl;
