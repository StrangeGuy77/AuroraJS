const mailer = require("nodemailer");
const { Contactmailer, DefaultLocale, userSession } = require("../keys");
const helper = require("../helpers/libs");

const ctrl = {};

ctrl.firstRedirect = (req, res) => {
  userSession.userIp = req.ip;
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
    let language = req.params.language;
    let viewModel = await helper.init(language, true);
    viewModel.title = `${viewModel.language.sectionsInfo.home} - Aurora Development`;
    res.render("sections/homeSection/homeIndex", viewModel);
  } else {
    res.send(`/${DefaultLocale.preferedUserLanguage}/not-available`);
  }

};

// For our services section

ctrl.services = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.sectionsInfo.ourServices} - Aurora Development`;
  res.render("sections/ourServicesSection/ourServicesView", viewModel);
};

ctrl.servicesSend = async (req, res) => {
  res.send("sent!");
};

// About us

ctrl.aboutUs = async (req, res) => {
  res.send("about us section");
};

// Mailers

ctrl.contact = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.sectionsInfo.contactUs} - Aurora Development`;
  res.render("sections/contactUsSection/mailer", viewModel);
};

ctrl.userAgreement = async (req, res) => {
  let language = req.params.language;
  let viewModel = await helper.init(language, true);
  viewModel.title = `${viewModel.language.userAgreementPolicy.userAgreementPolicyTitle} - Aurora Development`;

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

ctrl.getLanguageJSON = async (req, res) => {
  let toTranslateJSON = await require(`../locales/${DefaultLocale.preferedUserLanguage}.json`);
  res.send(JSON.stringify(toTranslateJSON));
};

// Errors

ctrl.error404 = async (req, res) => {
  let language = DefaultLocale.preferedUserLanguage;
  let viewModel = await helper.init(language, true);
  viewModel.title = `Error 404 - Aurora Development`;
  res.render("partials/errors/error404", viewModel);
};

ctrl.error403 = async (req, res) => {
  let language = DefaultLocale.preferedUserLanguage;
  let viewModel = await helper.init(language, true);
  viewModel.title = `Error 403 - Aurora Development`;
  res.render("partials/errors/error403", viewModel);
};

ctrl.error503 = async (req, res) => {
  let language = DefaultLocale.preferedUserLanguage;
  let viewModel = await helper.init(language, true);
  viewModel.title = `Error 503 - Aurora Development`;
  res.render("partials/errors/error503", viewModel);
};

ctrl.error504 = async (req, res) => {
  let language = DefaultLocale.preferedUserLanguage;
  let viewModel = await helper.init(language, true);
  viewModel.title = `Error 504 - Aurora Development`;
  res.render("partials/errors/error504", viewModel);
};

module.exports = ctrl;
