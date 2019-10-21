const express = require("express");
const router = express.Router();
const home = require("../controllers/home");
const software = require("../controllers/software");
const library = require("../controllers/library");
const user = require("../controllers/user");
const bcmb = require("../controllers/apiConnections");

module.exports = app => {
  // Index or single pages routes
  router.get("/", home.firstRedirect);
  router.get("/:language", home.index);
  router.get("/:language/user-agreement-terms", home.userAgreement);
  router.get("/:language/contact-us", home.contact);
  router.get("/:language/about-us", home.aboutUs);
  router.post("/contact-us/send", home.contactSend);
  router.post("/getLanguageJSON", home.getLanguageJSON);

  // Our services routes
  router.get("/:language/our-services", home.services);
  router.post("/our-services/send", home.servicesSend);

  // Software routes
  router.get("/:language/software", software.index);
  router.get("/:language/software/:software_id", software.view);
  router.get("/:language/software/:software_id/download", software.download);
  router.get("/:language/software/:software_id/buy", software.buy);
  router.post("/:language/software", software.create);
  router.post("/software/:software_id/like", software.like);
  router.post("/software/:software_id/comment", software.comment);
  router.delete("/software/:software_id/delete", software.delete);

  // Library routes
  router.get("/:language/library", library.index);
  // For books
  router.get("/:language/library/books/upload", library.bookUploadView);
  router.get("/:language/library/books/:book_id", library.bookView);
  router.post("/library/books/upload", library.bookUploadProcess);
  router.post("/library/books/:book_id/comment", library.bookComment);
  router.post("/library/books/:book_id/like", library.bookLike);
  router.delete("/library/:book_id/delete", library.bookDelete);
  // For courses
  router.get("/:language/library/courses/upload", library.courseUploadView);
  router.get("/:language/library/courses/:course_id", library.courseView);
  router.post("/library/courses/upload", library.courseUploadProcess);
  router.post("/library/courses/:course_id/comment", library.courseComment);
  router.post("/library/courses/:course_id/like", library.courseLike);
  router.delete("/library/:course_id/delete", library.courseDelete);
  // For both
  router.post("/library/wishlist-add", library.wishlistAdd);

  // User routes
  router.get("/:language/login", user.login);
  router.get("/:language/signup", user.signup);
  router.get("/:language/profile", user.profile);
  router.get("/:language/users/:user_id", user.visit);
  router.get("/:language/users/verification/:userid", user.accountConfirmation);
  router.get(
    "/:language/users/:user_id/:activation_code",
    user.accountConfirmation
  );
  router.post("/login", user.loginProcess);
  router.post("/signup", user.signupProcess);
  router.post("/signout", user.signout);
  router.post("/save-settings", user.saveProfileSettings);
  router.post(
    "/:language/users/:user_id/profile/pic-upload",
    user.profilePicUpload
  );

  // User profile routes
  router.get("/:language/stats", user.stats);

  // Google auth
  router.get("/google/auth", bcmb.googleAuthentication);

  // Error router
  router.get("/:language/admin", home.error403);
  router.get("/:language/not-available", home.error503);
  router.get("/:language/timeout", home.error504);
  router.get("*", home.error404);

  app.use(router);
};
