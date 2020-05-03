var express = require("express");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var authentication = require("./utils/authentication");
var routes = require("./routes");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.FE_URL); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, GET, DELETE, OPTIONS"
  );
  next();
});

app.use(authentication);
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    stack: app.get("env") === "development" ? err.stack : {},
  });
});

module.exports = app;
