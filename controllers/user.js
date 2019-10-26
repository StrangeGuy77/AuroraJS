const { user } = require("../models/index");
const helper = require("../helpers/libs");
const confirmationHtml = require("../helpers/confirmationEmail");
const {
  DefaultLocale,
  userSession,
  Contactmailer,
  GithubApi
} = require("../keys");
const mailer = require("nodemailer");
const path = require("path");
const fs = require("fs-extra");
const GoogleAuthentication = require("@authentication/google");
const fetch = require("node-fetch");

const ctrl = {};

ctrl.index = (req, res) => {
  res.send("user index");
};

ctrl.login = async (req, res) => {
  let language = req.params.language;
  if (userSession.actualUserSession === 0) {
    let viewModel = await helper.init(language);
    viewModel.title = `${viewModel.language.login} - Aurora Development`;
    res.render("sections/userSections/normalUserSections/login", viewModel);
  } else {
    res.redirect("/");
  }
};

ctrl.loginProcess = async (req, res) => {
  let toTranslateJSON = await require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);

  let email = req.body.email;
  let password = req.body.password;

  let userToLogin = await user.find({ user_email: email, password: password });
  if (userToLogin.length > 0) {
    userSession.username = userToLogin[0].username;
    userSession.actualUserSession = userToLogin[0].user_role;
    userSession.userId = userToLogin[0].userId;
    userSession.email = userToLogin[0].user_email;
    let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;
    res.send(JSON.stringify(redirectLink));
  } else {
    let toStringifyAnswer = toTranslateJSON.signUpInfo.WrongEmailOrPassword;
    res.send(JSON.stringify(toStringifyAnswer));
    res.status(500);
  }
};

ctrl.profile = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true, true);
  viewModel.title = `${viewModel.language.userInfo.MyProfile} - Aurora Development`;
  if (viewModel.session.nonlogged) {
    res.redirect(`/${DefaultLocale.preferedUserLanguage}/login`);
  } else {
    let userSettings = await user.findOne({ userId: userSession.userId });
    viewModel.session.userSettings = userSettings;
    viewModel.payment_collection =
      viewModel.session.userSettings.payment_collection;

    // Contact section of profile.
    // Github verification
    if (userSettings.github !== "") {
      // Delete this verification after development
      if (userSettings.github === "StrangeGuy") {
        userSettings.github = "StrangeGuy77";
      }
      const { client_id, client_secret } = GithubApi;
      let gitInfo = await fetch(
        `http://api.github.com/users/${userSettings.github}?client_id=${client_id}&client_secret=${client_secret}`
      );
      let gitRepos = await fetch(
        `http://api.github.com/users/${userSettings.github}/repos?client_id=${client_id}&client_secret=${client_secret}&per_page=4&sort=committer-date-desc`
      );

      gitInfo = await gitInfo.json();
      gitRepos = await gitRepos.json();
      viewModel.gitInfo = gitInfo;
      viewModel.gitRepos = gitRepos;
    } else {
      userSettings.github = false;
    }

    res.render("sections/userSections/normalUserSections/profile", viewModel);
  }
};

ctrl.profilePicUpload = async (req, res) => {
  let CurrentLanguage = req.params.language;
  let url = helper.randomId();
  let result = await user.findOne({ userId: req.params.user_id });
  const imageTempPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const targetPath = path.resolve(`src/public/upload/profile/${url}${ext}`);
  if (
    ext === ".png" ||
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".gif" ||
    ext === ".svg"
  ) {
    // Therefore filesystem can rename images with their final name within db
    await fs.rename(imageTempPath, targetPath);
    result.profile_pic = `${url}${ext}`;
    await result.save();

    res.redirect(`/${CurrentLanguage}/profile`);
  } else {
    // Not correct image extension? unlink from marked path before.
    await fs.unlink(imageTempPath);
    res.render("partials/errors/error500");
  }
};

ctrl.signup = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.register} - Aurora Development`;
  res.render("sections/userSections/normalUserSections/signup", viewModel);
};

ctrl.signupProcess = async (req, res) => {
  let toTranslateJSON = {};
  toTranslateJSON = await require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);

  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  if (req.body.from === "facebook") {
    username = req.body.name;
    if (req.body.email === undefined) {
      email = `facebookEmail${helper.randomId()}@xxx.com`;
    } else {
      email = req.body.email;
    }
  }

  let usernameResult = await user.find({ username: username });
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
      var userId;
      let idResult = 0;
      do {
        userId = helper.randomId();
        idResult = await user.find({ userId: userId });
      } while (idResult.length > 0);
      var newUser = new user({
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
      userSession.email = email;
      userSession.actualUserSession = 1;
      userSession.userId = userId;
    }

    // Send confirmation email

    let transporter = mailer.createTransport({
      host: "smtp.stackmail.com",
      port: 587,
      secure: false,
      auth: {
        user: Contactmailer.ConfirmEmail.user,
        pass: Contactmailer.ConfirmEmail.pass
      }
    });

    let userData = {
      username: username,
      language: DefaultLocale.preferedUserLanguage,
      user_id: userId,
      verif_code: newUser.user_activation_key
    };

    let mailOptions = {
      from: Contactmailer.ConfirmEmail.user,
      to: email,
      subject: "Confirm your account!",
      text: "",
      html: confirmationHtml(userData)
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        res.status(200);
      }
    });
    let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;
    res.send(JSON.stringify(redirectLink));
  }
};

ctrl.accountConfirmation = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true, true);
  viewModel.title = `${viewModel.language.profile} - Aurora Development`;
  console.log(req.params);
  res.send("Huh this works!");
};

ctrl.saveProfileSettings = async (req, res) => {
  let toTranslateJSON = await require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);

  let temporal = req.body;
  let settings;

  let actualUserInfo = await user.find({ userId: userSession.userId });

  settings = {
    password:
      temporal.changePassword === "" || temporal.changePassword === null
        ? actualUserInfo[0].password
        : temporal.changePassword,
    user_email:
      temporal.email === "" || temporal.email === null
        ? actualUserInfo[0].user_email
        : temporal.email,
    name:
      temporal.name === "" || temporal.name === null
        ? actualUserInfo[0].name
        : temporal.name,
    lastname:
      temporal.lastname === "" || temporal.lastname === null
        ? actualUserInfo[0].lastname
        : temporal.lastname,
    cellphone:
      temporal.cellphone === "" || temporal.cellphone === null
        ? actualUserInfo[0].cellphone
        : temporal.cellphone,
    worksite:
      temporal.worksite === "" || temporal.worksite === null
        ? actualUserInfo[0].worksite
        : temporal.worksite,
    enterprise:
      temporal.enterprise === "" || temporal.enterprise === null
        ? actualUserInfo[0].enterprise
        : temporal.enterprise,
    country:
      temporal.country === "" || temporal.country === null
        ? actualUserInfo[0].country
        : temporal.country,
    city:
      temporal.city === "" || temporal.city === null
        ? actualUserInfo[0].city
        : temporal.city,
    github:
      temporal.github === "" || temporal.github === null
        ? actualUserInfo[0].github
        : temporal.github,
    webpage:
      temporal.webpage === "" || temporal.webpage === null
        ? actualUserInfo[0].webpage
        : temporal.webpage,
    show_public_name:
      temporal.show_public_name === actualUserInfo[0].show_public_name
        ? actualUserInfo[0].show_public_name
        : temporal.show_public_name,
    show_public_email:
      temporal.show_public_email === actualUserInfo[0].show_public_email
        ? actualUserInfo[0].show_public_email
        : temporal.show_public_email,
    show_public_location:
      temporal.show_public_location === actualUserInfo[0].show_public_location
        ? actualUserInfo[0].show_public_location
        : temporal.show_public_location
  };

  var query = { userId: userSession.userId };

  let checkIfUserIsNotRepeated = await user.find({
    user_email: settings.user_email
  });

  if (
    checkIfUserIsNotRepeated.length > 0 &&
    checkIfUserIsNotRepeated[0].userId === userSession.userId
  ) {
    let toStringifyAnswer =
      toTranslateJSON.userInfo.TheresAnUserWithThatEmailAlready;
    res.send(JSON.stringify(toStringifyAnswer));
    res.status(500);
  } else {
    user
      .findOneAndUpdate(query, settings, { upsert: true }, function(err, doc) {
        if (err) {
          res.status(500);
          res.send("There was an error saving the information");
        }
        // Doc param has inside the updated info of the user.
        let toStringifyAnswer =
          toTranslateJSON.userInfo.InformationSuccessfullySaved;
        res.status(200);
        res.send(JSON.stringify(toStringifyAnswer));
      })
      .catch(reason => {
        res.send(JSON.stringify("There was an error saving the information"));
        console.log(reason);
      });
  }
};

ctrl.signout = (req, res) => {
  userSession.username = "defaultUsername";
  userSession.actualUserSession = 0;
  userSession.userId = 0;
  userSession.email = "";
  let redirectLink = `/${DefaultLocale.preferedUserLanguage}`;
  res.send(JSON.stringify(redirectLink));
};

ctrl.visit = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  let user_id = req.params.user_id;
  let userInfo = await user.findOne({ username: user_id });
  if (userInfo) {
    viewModel.userInfo = userInfo;
    viewModel.title = `${userInfo.username} - Profile`;
    if (userInfo.github !== "") {
      // Delete this verification after development
      if (userInfo.github === "StrangeGuy") {
        userInfo.github = "StrangeGuy77";
      }
      const { client_id, client_secret } = GithubApi;
      let gitInfo = await fetch(
        `http://api.github.com/users/${userInfo.github}?client_id=${client_id}&client_secret=${client_secret}`
      );
      let gitRepos = await fetch(
        `http://api.github.com/users/${userInfo.github}/repos?client_id=${client_id}&client_secret=${client_secret}&per_page=4&sort=committer-date-desc`
      );

      gitInfo = await gitInfo.json();
      gitRepos = await gitRepos.json();
      viewModel.gitInfo = gitInfo;
      viewModel.gitRepos = gitRepos;
    } else {
      userInfo.github = false;
    }
    res.render(
      "sections/userSections/normalUserSections/otherUserProfile",
      viewModel
    );
  } else {
    res.redirect(`/${language}`);
  }
};

ctrl.stats = async (req, res) => {
  if (
    !(userSession.actualUserSession === 4) &&
    !(userSession.actualUserSession === 5)
  ) {
    res.redirect(`/${DefaultLocale.preferedUserLanguage}/admin`);
  } else {
    let language = req.params.language;
    let viewModel = await helper.init(language, true, true);
    viewModel.title = `${viewModel.language.stats} - Aurora Development`;
    res.render("sections/userSections/adminSections/stats", viewModel);
  }
};

module.exports = ctrl;
