/*jshint esversion: 6 */

"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compress = require("compression");

const app = express();

// Enable reverse proxy support in Express. This causes the the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See http://expressjs.com/api#app-settings for more details.
app.enable("trust proxy");

// CORS
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(compress());

app.use("/", express.static(__dirname + "/build/", { redirect: false }));

app.all("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

// Start the app by listening on the port supplied or defaults to 8080
const HTTP_PORT = process.env.PORT || 3001;
app.listen(HTTP_PORT);

console.log(`listening on ${HTTP_PORT}`);
