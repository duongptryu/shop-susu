const express = require("express");
const controller = require("../controller/product");
const auth = require("../controller/auth");
const requestAuth = require("../middleware/auth.midleware");



const router = express.Router();

router.get("/login", requestAuth.logged, auth.getLoginPage);

router.post("/dologin", auth.doLogin);

router.get("/", requestAuth.requestAuth, controller.getHomePage);

router.get('/logout', auth.logout);

module.exports = router;