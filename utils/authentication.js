const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const { User } = require("../models");

const router = express.Router();

router.use(
  session({
    secret: "anderson",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 100 * 60 * 60 * 24 * 30 }, // = 30 days
  })
);
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ where: { username } })
      .then((user) => {
        const isCorrectPassword = bcrypt.compareSync(
          password,
          (user && user.password) || ""
        );
        if (isCorrectPassword) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((e) => done(e));
  })
);
passport.serializeUser(function (user, done) {
  console.log(user.id);
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  console.log(id);
  User.findOne({ where: { id } }).then(function (user) {
    done(null, user);
  });
});

module.exports = router;
