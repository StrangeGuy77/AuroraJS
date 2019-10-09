module.exports = {
  database: {
    URI: "mongodb://localhost/auroradevelopment"
  },
  Contactmailer: {
    ContactEmail: {
      user: "email@auroradevelopment.com",
      pass: "emailPassword"
    },
    ConfirmEmail: {
      user: "email@auroradevelopment.com",
      pass: "emailPassword"
    }
  },
  Api: {
    client_id: "client_id",
    client_secret: "client_secret"
  },
  DefaultLocale: {
    defaultLanguage: "en",
    preferedUserLanguage: "en"
  },
  userSession: {
    actualUserSession: 0,
    userId: 0,
    username: "",
    email: "",
    userIp: ""
  }
};
