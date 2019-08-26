const express = require("express");
const router = express.Router();
const home = require("../controllers/home");
const software = require("../controllers/software");
const library = require("../controllers/library");
const user = require("../controllers/user");
const bcmb = require("../controllers/bancolombia");

module.exports = app => {
  // Index or single pages routes
  router.get("/", home.index);
  router.get("/our-services", home.services);
  router.get("/contact-us", home.contact);
  router.post("/contact-us/send", home.contactSend);
  router.post("/our-services/send", home.servicesSend);

  // Software routes
  router.get("/software/:software_id", software.index);
  router.post("/software", software.create);
  router.post("/software/:software_id/like", software.like);
  router.post("/software/:software_id/comment", software.comment);
  router.delete("/software/:software_id/delete", software.delete);

  // Library routes
  router.get("/library", library.index);
  router.post("/library/upload", library.create);
  router.post("/library/:book_id/like", library.like);
  router.post("/library/:book_id/comment", library.comment);
  router.delete("/library/:book_id/delete", library.delete);

  // User routes
  router.get("/login", user.login);
  router.get("/register", user.register);
  router.get("/profile", user.profile);
  router.get("/users/:userid", user.visit);
  router.post("/afterlog", user.index);

  // Bancolombia router test
  router.get("/oauth2/authorize/customers", bcmb.authorize), bcmb.session = 1;
  router.get("/oauth2/authorize/customers/success", bcmb.checkUser);
  router.get("/oauth2/authorize/paying", bcmb.authorize), bcmb.session = 2;
  router.get("/oauth2/authorize/paying/success", bcmb.payUser);

  // Error router
  router.get("/admin", home.error403);
  router.get("/not-available", home.error503);
  router.get("/timeout", home.error504);
  router.get("*", home.error404);

  // Process router
  process.on("UnhandledPromiseRejectionWarning", home.unhandledPromise);

  app.use(router);
};
