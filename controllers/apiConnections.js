const { Api } = require("../keys");
const GoogleAuthentication = require("@authentication/google");

const ctrl = {};

ctrl.session = 0;

ctrl.authorize = async (req, res) => {
  var request = require("request");

  var options = {
    method: "POST",
    url: "https://sbapi.bancolombia.com/v2/security/oauth-otp/oauth2/token",
    headers: {
      accept: "application/json",
      authorization:
        "Basic 0a17b0f0-4ec4-4530-af1a-f460a6b66716:E8sE6jD1oM0sU0fT6cJ5dF0hE4vO6kB6fA5eF8wR8kW3pV4eD4"
    },
    form: {
      grant_type: "authorization_code",
      client_id: `0a17b0f0-4ec4-4530-af1a-f460a6b66716`,
      client_secret: `E8sE6jD1oM0sU0fT6cJ5dF0hE4vO6kB6fA5eF8wR8kW3pV4eD4`,
      scope: "Customer-basic:read:app"
    }
  };

  await request(options, function(error, response, body) {
    if (error) return console.error("Failed: %s", error.message);
    console.log("Success: ", body);

    var token = body.token_access;
    if (ctrl.session === 1) {
      console.log("Redireccionando a verificacion de cliente", token);
      res.redirect("/oauth2/success/customers/success");
    } else if (ctrl.session === 2) {
      console.log("Redireccionando a pagos");
      res.redirect("/oauth2/success/paying/success");
    }
  });
};

ctrl.checkUser = async (req, res) => {
  var options = {
    method: "POST",
    url:
      "https://sbapi.bancolombia.com/v1/sales-services/customer-partner/customer-reference-data/filials/customers/actions/validate-customer",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: {
      data: [
        { customer_documentType: "CC", customer_documentNumber: "1234567" }
      ]
    },
    json: true
  };

  await request(options, function(error, response, body) {
    if (error) return console.error("Failed: %s", error.message);

    console.log("Success: ", body);
    res.send(body);
  });
};

ctrl.payUser = (req, res) => {
  var options = {
    method: "POST",
    url:
      "https://sbapi.bancolombia.com/v1/business-support/human-resource-management/other-payments",
    headers: {
      accept: "application/vnd.bancolombia.v1+json",
      "content-type": "application/vnd.bancolombia.v1+json",
      authorization: `Bearer ${token}`
    },
    body:
      '{"data":[{"employer_nit":"123456789123456","payment_orderDate":"20180530","payment_time":"MEDIO_DIA","account_number":"12345678901","account_type":"Ahorros","payment_reference":"1231243","beneficiaries":[{"customer_documentType":"CC","customer_documentNumber":"12345678","customer_name":"John Doe","account_type":"ahorros","account_number":"10987654321","bank_remoteId":"20987654321","payment_orderValueAmount":1500000,"payment_orderReference":"Pago de nómina","payment_orderDate":"2018-05-30","payment_orderReference1":"123423","payment_orderReference2":"123423","payment_orderReference3":"123423","customer_email":"custumeremail@gmail.com"}]}]}'
  };

  request(options, function(error, response, body) {
    if (error) return console.error("Failed: %s", error.message);

    console.log("Success: ", body);
  });
};

ctrl.googleAuthentication = async (req, res) => {
  let options = {
    clientID:
      "275044837689-jt7k4bk2t45vl7eda5l4k2p88qp92bsu.apps.googleusercontent.com",
    clientSecret: "wB-FkVUBI2YCI5mY9g__PIS0",
    callbackURL: ""
  };
  const googleAuthentication = new GoogleAuthentication(options);

  const {
    accessToken,
    refreshToken,
    profile,
    state
  } = await googleAuthentication.completeAuthentication(req, res);
  console.log(await googleAuthentication.completeAuthentication(req, res));
};

module.exports = ctrl;
