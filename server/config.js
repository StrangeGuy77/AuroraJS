const path = require("path");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const multer = require("multer");
const express = require("express");
const routes = require("../routes/index");
const i18n = require("i18n");
const errorHandler = require("errorhandler");

module.exports = app => {
  // Configuration
  app.set("port", process.env.PORT || 3000);
  app.set("views", path.join(__dirname, "../views"));
  app.engine(
    ".hbs",
    exphbs({
      defaultLayout: "main",
      partialsDir: path.join(app.get("views"), "partials"),
      layoutsDir: path.join(app.get("views"), "layouts"),
      extname: ".hbs",
      helpers: require("./helpers")
    })
  );
  app.set("view engine", ".hbs");

  // Set i18n
  i18n.configure({
    locales: ["es", "en", "de", "fr"],
    directory: path.join(__dirname, "../locales"),
    cookie: "language"
  });

  // Middlewares

  app.use(i18n.init);
  if (process.env.env === "development") {
    app.use(morgan("dev"));
  }
  app.use(
    multer({
      dest: path.join(__dirname, "../public/upload/temp")
    }).single(`image`)
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Static files
  app.use("/public", express.static(path.join(__dirname, "../public")));

  // Routes
  routes(app);

  // Error handler
  "development" === process.env.env ? app.use(errorHandler) : null;

  process.env.HTTPS = true;

  return app;
};
