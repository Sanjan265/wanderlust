const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware");
const userController = require("../controller/user");


router.route("/signup")
    .get(userController.signup)
    .post(wrapAsync(userController.postSignup));

router.route("/login")
    .get(userController.login)
    .post(saveRedirectUrl,passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),userController.postLogin);

module.exports = router;