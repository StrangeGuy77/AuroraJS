const { user } = require("../models/index");
const helper = require("../helpers/libs");
const { DefaultLocale, userSession } = require("../keys");

const ctrl = {};

ctrl.index = (req, res) => {
  res.send("user index");
};

ctrl.login = (req, res) => {
  res.send("user login");
};

ctrl.loginProcess = async (req, res) => {
  res.send("user login");
};

ctrl.register = (req, res) => {
  res.send("user register");
};

ctrl.profile = (req, res) => {
  res.send("user profile");
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
      } while (idResult !== null);
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

ctrl.signout = (req, res) => {
  userSession.username = "defaultUsername";
  userSession.actualUserSession = 0;
  userSession.userId = 0;
  let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;
  res.send(JSON.stringify(redirectLink));
};

ctrl.visit = async (req, res) => {
  res.send("x user profile");
};

module.exports = ctrl;
