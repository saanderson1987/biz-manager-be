var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var passport = require("passport");
var flash = require("connect-flash");
var session = require("express-session");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");
var helmet = require("helmet");
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

app.use(
  session({
    secret: "anderson",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 100 * 60 * 60 * 24 * 30 }, // = 30 days
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", routes);

// const User = require("./models/user.js");

// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     User.getByQuery({ username })
//       .then(function (users) {
//         const user = Object.values(users)[0];
//         const isCorrectPassword = bcrypt.compareSync(
//           password,
//           (user && user.password) || ""
//         );
//         if (isCorrectPassword) {
//           return done(null, user);
//         }
//         return done(null, false);
//       })
//       .catch((e) => done(e));
//   })
// );
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });
// passport.deserializeUser(function (id, done) {
//   User.getById(id).then(function (user) {
//     done(null, user);
//   });
// });

// function getAuthenticationReturnObject({ isAuthenticated, user }) {
//   const object = { isAuthenticated };
//   if (user && user.id && user.username) {
//     object.user = {
//       id: user.id,
//       username: user.username,
//     };
//   }
//   return object;
// }

// app.get("/isAuthenticated", (req, res) => {
//   const authenticationReturnObject = getAuthenticationReturnObject({
//     isAuthenticated: req.isAuthenticated(),
//     user: req.user,
//   });
//   res.send(authenticationReturnObject);
// });

// app.post("/login", function (req, res, next) {
//   passport.authenticate("local", function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         const loginError = new Error("Error logging in");
//         loginError.status = 401;
//         return next(loginError);
//       }
//       const authenticationReturnObject = getAuthenticationReturnObject({
//         isAuthenticated: true,
//         user,
//       });
//       return res.send(authenticationReturnObject);
//     });
//   })(req, res, next);
// });

// app.get("/logout", (req, res) => {
//   req.logout();
//   res.send({ isAuthenticated: req.isAuthenticated() });
// });

// function requireAuthentication(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.send("Please log in");
//   }
// }

// const apiRouter = require("./routes/router");
// app.use("/api", requireAuthentication, apiRouter);

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
