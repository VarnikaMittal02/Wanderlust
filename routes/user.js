const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController=require("../controllers/users.js");

//compact ----router.route (common path combine)


// for get and post signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup)
);


// for get and post login
router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);



//logout
router.get("/logout", userController.logout );


module.exports = router;
