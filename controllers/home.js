const mailer = require("nodemailer");
const { Contactmailer, DefaultLocale, userSession } = require("../keys");
const userSessionVerification = require("../helpers/userVerification");

const ctrl = {};

ctrl.firstRedirect = (req, res) => {
  let ip = req.ip;
  userSession.userIp = ip;
  res.redirect(`/${DefaultLocale.preferedUserLanguage}`);
};

ctrl.index = async (req, res) => {
  let lang = req.params.language;
  if (
    lang === "es" ||
    lang === "en" ||
    lang === "de" ||
    lang === "fr" ||
    lang === "it" ||
    lang === "jp"
  ) {
    DefaultLocale.preferedUserLanguage = lang;
    let toTranslateJSON = require(`../locales/${req.params.language}.json`);
    // User session verification
    let actualUserSession = userSession.actualUserSession;
    let userProperties = {};
    userProperties = userSessionVerification.userSessionResponse(
      actualUserSession
    );

    let viewModel = {
      title: `${toTranslateJSON.home} - Aurora Development`,
      session: {}
    };
    viewModel.language = toTranslateJSON;
    viewModel.language.CurrentLanguage = lang;
    viewModel.session = userProperties;
    viewModel.session.username = userSession.username;

    res.render("sections/homeSection/homeIndex", viewModel);
  } else {
    let toTranslateJSON = require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);
    let viewModel = { title: "Error 404", language: {} };
    viewModel.language = toTranslateJSON;
    viewModel.language.CurrentLanguage = DefaultLocale.preferedUserLanguage;
    res.render("partials/errors/error404", viewModel);
  }
};

// For our services section

ctrl.services = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  let viewModel = {
    title: `${toTranslateJSON.ourServices} - Aurora Development`,
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("sections/ourServicesSection/ourServicesView", viewModel);
};

ctrl.servicesSend = (req, res) => {
  res.send("sent!");
};

// About us

ctrl.aboutUs = (req, res) => {
  res.send("about us section");
};

// Mailers

ctrl.contact = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );

  let viewModel = {
    title: `${toTranslateJSON.contactUs} - Aurora Development`,
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("sections/contactUsSection/mailer", viewModel);
};

ctrl.userAgreement = (req, res) => {
  let toTranslateJSON = require(`../locales/${req.params.language}.json`);
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );
  let viewModel = {
    title: `${toTranslateJSON.userAgreementPolicy.userAgreementPolicyTitle} - Aurora Development`,
    language: {}
  };
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = req.params.language;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("partials/extras/userAgreementTerms", viewModel);
};

ctrl.contactSend = async (req, res) => {
  let transporter = mailer.createTransport({
    host: "smtp.stackmail.com",
    port: 587,
    secure: false,
    auth: {
      user: Contactmailer.ContactEmail.user,
      pass: Contactmailer.ContactEmail.pass
    }
  });

  // Regex pattern for email verification
  let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let email = req.body.sender;

  let mailOptions = {
    from: Contactmailer.ContactEmail.user,
    to: Contactmailer.ContactEmail.user,
    subject: req.body.subject,
    text: req.body.issue
  };

  if (mailOptions.from === "emailnotavailable") {
    res.render("partials/errors/error500", {
      reason: `El correo electrónico ingresado es incorrecto, por favor ingréselo una vez más`
    });
  } else {
    await transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        res.redirect(`/${DefaultLocale.preferedUserLanguage}/timeout`);
      } else {
        res.redirect(`/${DefaultLocale.preferedUserLanguage}/contact-us`);
        console.log("Email sent: " + info.response);
      }
    });
  }
};

// Translation helper

ctrl.getLanguageJSON = (req, res) => {
  let toTranslateJSON = require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);
  res.send(JSON.stringify(toTranslateJSON));
};

// Errors

ctrl.error404 = (req, res) => {
  let toTranslateJSON = require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);
  let viewModel = { title: "Error 404", language: {} };
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = DefaultLocale.preferedUserLanguage;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("partials/errors/error404", viewModel);
};

ctrl.error403 = (req, res) => {
  let toTranslateJSON = require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);
  let viewModel = { title: "Error 403", language: {} };
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = DefaultLocale.preferedUserLanguage;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("partials/errors/error403", viewModel);
};

ctrl.error503 = (req, res) => {
  let toTranslateJSON = require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);
  let viewModel = { title: "Error 503", language: {} };
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = DefaultLocale.preferedUserLanguage;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("partials/errors/error503", viewModel);
};

ctrl.error504 = (req, res) => {
  let toTranslateJSON = require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);
  let viewModel = { title: "Error 504", language: {} };
  let actualUserSession = userSession.actualUserSession;
  let userProperties = {};
  userProperties = userSessionVerification.userSessionResponse(
    actualUserSession
  );
  viewModel.language = toTranslateJSON;
  viewModel.language.CurrentLanguage = DefaultLocale.preferedUserLanguage;
  viewModel.session = userProperties;
  viewModel.session.username = userSession.username;
  res.render("partials/errors/error504", viewModel);
};

ctrl.unhandledPromise = (req, res) => {
  console.log("Rechazo de promesa sin manejar");
};

module.exports = ctrl;
