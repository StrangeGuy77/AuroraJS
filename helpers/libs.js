const { userSession } = require("../keys");
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
  let size = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
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

helper.init = async (language = "en", getUsername = false, getUseremail = false) => {
  let includeUseremail = getUseremail;
  let includeUsername = getUsername;
  let toTranslateJSON = require(`../locales/${language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  const viewModel = {};
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = language;
  viewModel.session = userProperties;
  if (includeUsername) {
    viewModel.session.username = userSession.username;
  }
  if (includeUseremail){
    viewModel.session.email = userSession.email;
  }
  return viewModel;
};

module.exports = helper;
