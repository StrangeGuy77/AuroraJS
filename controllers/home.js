const mailer = require("nodemailer");
const { Contactmailer } = require("../keys");
const { software } = require("../models/index");

const ctrl = {};

ctrl.index = async (req, res) => {
  const softwares = await software.find().sort({ timestamp: -1 });
  res.render("index", {
    softs: softwares,
    title: "Software - Aurora Development"
  });
};

// For our services section

ctrl.services = (req, res) => {
  res.render("index", { title: "Nuestros servicios - Aurora Development" });
};

ctrl.servicesSend = (req, res) => {
  res.send("sent!");
};

// Mailers

ctrl.contact = (req, res) => {
  res.render("mailer", { title: "Contacto - Aurora Development" });
};

ctrl.contactSend = async (req, res) => {
  let transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: Contactmailer.user,
      pass: Contactmailer.pass
    }
  });

  let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let email = req.body.sender;

  let mailOptions = {
    from: pattern.test(email) ? email.toLowerCase() : "emailnotavailable",
    to: "jhonatanrg@live.co",
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
        res.redirect("/timeout");
      } else {
        res.redirect("/contact-us");
        console.log("Email sent: " + info.response);
      }
    });
  }
};

// Errors

ctrl.error404 = (req, res) => {
  res.render("partials/errors/error404", { title: "Error 404" });
};

ctrl.error403 = (req, res) => {
  res.render("partials/errors/error403", { title: "Error 403" });
};

ctrl.error503 = (req, res) => {
  res.render("partials/errors/error503", { title: "Error 503" });
};

ctrl.error504 = (req, res) => {
  res.render("partials/errors/error504", { title: "Error 504" });
};

ctrl.unhandledPromise = (req, res) => {
  console.log('Rechazo de promesa sin manejar');
}

module.exports = ctrl;
