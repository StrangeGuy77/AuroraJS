const { user } = require("../models/index");
const helper = require("../helpers/libs");
const { DefaultLocale, userSession } = require("../keys");
const userSessionVerification = require("../helpers/userVerification");

const ctrl = {};

ctrl.index = (req, res) => {
  res.send("user index");
};

ctrl.login = (req, res) => {
  res.send("user login");
};

ctrl.loginProcess = async (req, res) => {
  let toTranslateJSON = {};
  toTranslateJSON = await require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);

  let email = req.body.email;
  let password = req.body.password;

  let userToLogin = await user.find({ user_email: email, password: password });
  if (userToLogin.length > 0) {
    userSession.username = userToLogin[0].username;
    userSession.actualUserSession = userToLogin[0].user_role;
    userSession.userId = userToLogin[0].userId;
    let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;
    res.send(JSON.stringify(redirectLink));
  } else {
    let toStringifyAnswer = toTranslateJSON.signUpInfo.WrongEmailOrPassword;
    res.send(JSON.stringify(toStringifyAnswer));
    res.status(500);
  }
};

ctrl.register = (req, res) => {
  res.send("user register");
};

ctrl.profile = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  if (userProperties.nonlogged) {
    res.redirect(`/${DefaultLocale.preferedUserLanguage}/login`);
  } else {
    let viewModel = {
      title: `${toTranslateJSON.userInfo.MyProfile} - Aurora Development`,
      language: {}
    };
    viewModel.language = toTranslateJSON;
    viewModel.language.CurrentLanguage = req.params.language;
    viewModel.session = userProperties;
    viewModel.session.username = userSession.username;
    res.render("sections/userSections/normalUserSections/profile", viewModel);
  }
};

ctrl.signup = async (req, res) => {
  let toTranslateJSON = {};
  toTranslateJSON = await require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);

  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let usernameResult = {};
  usernameResult = await user.find({ username: username });
  if (usernameResult.length > 0) {
    let toStringifyAnswer =
      toTranslateJSON.signUpInfo.TheresAnUserWithThatUsername;
    res.send(JSON.stringify(toStringifyAnswer));
    res.status(500);
  } else {
    let emailResult = {};
    emailResult = await user.find({ user_email: email });
    if (emailResult.length > 0) {
      let toStringifyAnswer =
        toTranslateJSON.signUpInfo.TheresAnUserWithThatEmail;
      res.send(JSON.stringify(toStringifyAnswer));
      res.status(500);
    } else {
      let userId;
      let idResult = 0;
      do {
        userId = helper.randomId();
        idResult = await user.find({ userId: userId });
      } while (idResult.length > 0);
      const newUser = new user({
        userId: userId,
        username: username,
        password: password,
        user_email: email,
        user_activation_key: helper.verificationCode(),
        user_status: 1,
        user_role: 1
      });
      await newUser.save().catch(reason => {
        console.log("Error registering a new user: " + reason);
      });
      userSession.username = username;
      userSession.actualUserSession = 1;
      userSession.userId = userId;
      let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;
      res.send(JSON.stringify(redirectLink));
    }
  }
};

ctrl.saveProfileSettings = (req, res) => {
  res.send("ok!");
};

ctrl.signout = (req, res) => {
  userSession.username = "defaultUsername";
  userSession.actualUserSession = 0;
  userSession.userId = 0;
  let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;
  res.send(JSON.stringify(redirectLink));
};

ctrl.userVerification = () => {
  res.send("Everything goes well!");
};

ctrl.visit = async (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  res.redirect(`/${DefaultLocale.preferedUserLanguage}/login`);

  let viewModel = {
    title: `${toTranslateJSON.userInfo.MyProfile} - Aurora Development`,
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("sections/userSections/normalUserSections/profile", viewModel);
};

ctrl.stats = async (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  if (!userProperties.adminuser && !userProperties.superuser) {
    res.redirect(`/${DefaultLocale.preferedUserLanguage}/admin`);
  } else {
    let viewModel = {
      title: `${toTranslateJSON.stats} - Aurora Development`,
      language: {}
    };
    viewModel.language = toTranslateJSON;
    viewModel.language.CurrentLanguage = req.params.language;
    viewModel.session = userProperties;
    viewModel.session.username = userSession.username;
    res.render("sections/userSections/adminSections/stats", viewModel);
  }
};

module.exports = ctrl;
