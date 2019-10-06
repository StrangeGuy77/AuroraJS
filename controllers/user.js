const { user } = require("../models/index");
const helper = require("../helpers/libs");
const confirmationHtml = require("../helpers/confirmationEmail");
const { DefaultLocale, userSession, Contactmailer } = require("../keys");
const userSessionVerification = require("../helpers/userVerification");
const mailer = require("nodemailer");

const ctrl = {};

ctrl.index = (req, res) => {
  res.send("user index");
};

ctrl.login = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  let viewModel = {
    title: `${toTranslateJSON.login} - Aurora Development`,
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  res.render("sections/userSections/normalUserSections/login", viewModel);
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
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  if (userProperties.nonlogged) {
    res.redirect(`/${DefaultLocale.preferedUserLanguage}/login`);
  } else {
    let userSettings = await user.find({ userId: userSession.userId });
    let viewModel = {
      title: `${toTranslateJSON.userInfo.MyProfile} - Aurora Development`,
      language: {}
    };
    viewModel.language = toTranslateJSON;
    viewModel.language.CurrentLanguage = req.params.language;
    viewModel.session = userProperties;
    viewModel.session.userSettings = userSettings[0];
    res.render("sections/userSections/normalUserSections/profile", viewModel);
  }
};

ctrl.signup = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  let viewModel = {
    title: `${toTranslateJSON.register} - Aurora Development`,
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  res.render("sections/userSections/normalUserSections/signup", viewModel);
};

ctrl.signupProcess = async (req, res) => {
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
    if (false /*emailResult.length > 0*/) {
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
      // await newUser.save().catch(reason => {
      //   console.log("Error registering a new user: " + reason);
      // });
      userSession.username = username;
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
      subject: "Confirmation email",
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
  console.log(req.params);
  res.send("Huh this works!");
};

ctrl.saveProfileSettings = async (req, res) => {
  let toTranslateJSON = {};
  toTranslateJSON = await require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);

  let temporal = req.body;
  let settings = {};

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
    checkIfUserIsNotRepeated[0].userId !== userSession.userId
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
        let toStringifyAnswer =
          toTranslateJSON.userInfo.InformationSuccessfullySaved;
        res.status(200);
        res.send(JSON.stringify(toStringifyAnswer));
      })
      .catch(reason => {
        res.send(JSON.stringify("There was an error saving the information"));
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

  let viewModel = {
    title: `${toTranslateJSON.userInfo.MyProfile} - Aurora Development`,
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render(
    "sections/userSections/normalUserSections/otherUserProfile",
    viewModel
  );
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
