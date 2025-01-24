const contactData = require("../model/contact.model");
const nodemailer = require("nodemailer");
require("dotenv").config();
//^ DEFAULT API

let defaultRoute = async (req, res) => {
  res.send("Hello, Vercel!");
};

//^ POST CONTACT API = TO POST THE CONTACT INFO
let contactApi = async (req, res, next) => {
  console.log("post api for contact form");
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }
    let contactEntry = await contactData.create({
      name,
      email,
      message,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    transporter.verify((error, success) => {
      if (error) {
        console.error("Error connecting to Gmail:", error.message);
      } else {
        console.log("Gmail SMTP connection is successful!");
      }
    });
    let contactMail = async (email) => {
      let sentInfo = await transporter.sendMail({
        from: email,
        to: process.env.EMAIL,
        subject: "New Contact Form Submission",
        text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });
      console.log(sentInfo);
    };
    await contactMail(email);
    res.status(201).json({
      error: false,
      message: "I have received your mail,I'll back to you soon",
      data: contactEntry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  defaultRoute,
  contactApi,
};
