//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");
require('dotenv').config();

app.use(bodyParser.urlencoded({
  extended: true
}));

//get route for main page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

//post route for submitting currency types against the API
app.post("/", function(req, res) {

  let inputCrypto = req.body.crypto;
  let inputCurrency = req.body.currency;
  let inputAmount = req.body.amount;

  switch (inputCrypto) {
    case "BTC":
      var cryptoName = "Bitcoin";
      break;

    case "ETH":
      cryptoName = "Etherium";
      break;

    case "LTC":
      cryptoName = "Litecoins";
      break;

    default:
      console.log("unexpected value for var inputCrypto");
  }

  switch (inputCurrency) {
    case "USD":
      var currencyName = "US Dollars";
      break;

    case "GBP":
      currencyName = "Great British Pounds";
      break;

    case "EUR":
      currencyName = "Euros";
      break;

    default:
      console.log("unexpected value for var currency");
  }

  var options = {
    url: process.env.API_URL + "exchange-rates",
    method: "GET",
    qs: {
      key: process.env.API_KEY
    }
  };

request(options, function(error, response, body) {
  let data = JSON.parse(body);
  let currentValue = 0;
  let currentDate = 0;
  let typeCurrency = 0;

  data.forEach((item, index, array) => {

    if  (item.currency == inputCurrency) {
      typeCurrency = item.rate;
    }

    if (item.currency == inputCrypto) {
      currentDate = item.timestamp;
      currentValue = item.rate;
    }
  });

  res.write("<p>The current date is " + currentDate + "</p>");
  res.write("<h1>" + inputAmount + " " + cryptoName + " is currently worth $" +
    ((currentValue*inputAmount)*typeCurrency).toFixed(2) + " " + currencyName + " </h1>");
  res.send();
});
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
