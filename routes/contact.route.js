const express = require("express");
const cors = require("cors");
const {
  defaultRoute,
  contactApi,
} = require("../controller/contact.controller");

let router = express.Router();

// CORS configuration
const corsOptions = {
  origin: [
    "https://my-portfolio-f-five.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST"],
  credentials: true,
};

router.use(cors(corsOptions));
router.get("/", defaultRoute);
router.post("/contact", contactApi);

module.exports = router;
