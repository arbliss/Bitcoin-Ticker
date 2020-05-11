//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  // console.log(req.body.crypto);
  var crypto = req.body.crypto;
  var currency = req.body.currency;
  var amount = req.body.amount;

  switch (crypto) {
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
      console.log("unexpected value for var crypto");
  }

  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: crypto,
      to: currency,
      amount: amount
    }
  };

request(options, function(error, response, body) {
  var data = JSON.parse(body);
  var price = data.price;

  console.log(price);

  var currentDate = data.time;

  res.write("<p>The current date is " + currentDate + "</p>");
  res.write("<h1>" + amount + " " + cryptoName + " is currently worth " + price + " " + currency + "</h1>");
  res.send();
});
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
