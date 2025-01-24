const express = require("express");
const {
  defaultRoute,
  contactApi,
} = require("../controller/contact.controller");

let router = express.Router();
router.get("/", defaultRoute);
router.post("/contact", contactApi);
module.exports = router;
