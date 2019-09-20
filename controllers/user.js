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

ctrl.loginProcess = (req, res) => {
  res.send("user login");
};

ctrl.register = (req, res) => {
  res.send("user register");
};

ctrl.profile = (req, res) => {
  res.send("user profile");
};

ctrl.signup = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let usernameResult = await user.findOne({ username: username });

  if (usernameResult > 0) {
    res.json("Hay un usuario con ese nombre ya registrado.");
  } else {
    let emailResult = await user.findOne({ email: email });
    if (emailResult > 0) {
      res.json("Hay un usuario con ese correo ya registrado");
    } else {
      let userId;
      let idResult;
      do {
        userId = helper.randomId();
        idResult = await user.findOne({ userId: userId });
      } while (idResult > 0);
      const newUser = new user({
        userId: userId,
        username: username,
        password: password,
        user_email: email,
        user_registered_date: Date.now,
        user_activation_key: { type: Number },
        user_status: 1,
        user_role: 2
      });
      console.log(newUser);
    }
  }

  let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;

  res.send(JSON.stringify(redirectLink));
};

ctrl.visit = async (req, res) => {
  res.send("x user profile");
};

module.exports = ctrl;
