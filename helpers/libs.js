const { DefaultLocale, userSession, Contactmailer } = require("../keys");
const userSessionVerification = require("../helpers/userVerification");

const helper = {};

helper.randomName = () => {
  // '/()%' keywords send error whenever they're in the name of any image.
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomName = 0;
  for (let index = 0; index < 6; index++) {
    randomName += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomName;
};

helper.randomId = () => {
  const possible = "0123456789";
  let randomId = 0;
  for (let index = 0; index < 15; index++) {
    randomId += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomId;
};

helper.verificationCode = () => {
  const possible = "0123456789";
  let randomId = 0;
  for (let index = 0; index < 8; index++) {
    randomId += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomId;
};

helper.size = obj => {
  let size = 0,
    key;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

helper.toBoolean = string => {
  switch (string) {
    case "true":
      return true;
      break;
    case "false":
      return false;
      break;
    default:
      return false;
      break;
  }
};

helper.checkBuy = (collection, object) => {
  for (let index = 0; index < collection.length; index++) {
    if (collection[index].id === object) {
      index = collection.length + 1;
      return true;
    }
  }
  return false;
};

helper.init = async language => {
  let toTranslateJSON = require(`../locales/${language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  var viewModel = {
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = language;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  viewModel.session.email = userSession.email;
  return viewModel;
};

module.exports = helper;
