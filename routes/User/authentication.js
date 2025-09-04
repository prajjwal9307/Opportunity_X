const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/asyncWrapper.js');
const passport = require('passport');
const { saveRedirectUrl } = require("../../middleware/auth.js")
const user=require("../../controllers/user/route.js");


// Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
  (req, res) => {
    res.redirect("/home"); // redirect after success
  }
);



router.get("/signup", user.signup_get); 

router.post("/signup", wrapAsync(user.signup_post));

router.get("/login", user.login_get)

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), user.login_post)

router.get("/logout", user.logout)

module.exports = router;