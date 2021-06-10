var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const authUtils = require("./utils/authUtils.js");


/**
 * The function sign in the user to the system with the details that the user gives.
 * also the function check if the details is correct ' if not it will send message that somthing wrong .
 */
router.post("/Login", async (req, res, next) => {
  try {
    const user = await authUtils.existUsername(req.body.username);
    console.log(user);

    // check that username exists & the password is correct
  
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.username = user.username;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

/**
 * the function log out the user from the system if he is log in.
 */
router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
