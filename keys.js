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
    client_id: "0a17b0f0-4ec4-4530-af1a-f460a6b66716",
    client_secret: "E8sE6jD1oM0sU0fT6cJ5dF0hE4vO6kB6fA5eF8wR8kW3pV4eD4"
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
