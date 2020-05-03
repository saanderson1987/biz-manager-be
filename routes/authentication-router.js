const express = require("express");
const passport = require("passport");
const router = express.Router();

function getAuthenticationReturnObject({ isAuthenticated, user }) {
  const object = { isAuthenticated };
  if (user && user.id && user.username) {
    object.user = {
      id: user.id,
      username: user.username,
    };
  }
  return object;
}

router.get("/isAuthenticated", (req, res) => {
  const authenticationReturnObject = getAuthenticationReturnObject({
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
  res.send(authenticationReturnObject);
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    req.logIn(user, function (err) {
      if (err) {
        const loginError = new Error("Error logging in");
        loginError.status = 401;
        return next(loginError);
      }
      const authenticationReturnObject = getAuthenticationReturnObject({
        isAuthenticated: true,
        user,
      });
      return res.send(authenticationReturnObject);
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send({ isAuthenticated: req.isAuthenticated() });
});

module.exports = router;
