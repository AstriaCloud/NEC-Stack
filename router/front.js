const config = require("../config/config.js");
const express = require("express"),
  router = express.Router();
const bcrypt = require("bcrypt");
const rounding = 5;
const cookieParser = require("cookie-parser");
const database = require("./../middleware/database");
const cli = database.client;


router.get("*", (res,res) => {
    return res.json("value":true,"endpoint":"front");
});

// Export the router
module.exports = router;