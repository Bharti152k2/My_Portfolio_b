const contactData = require("../model/contact.model");
const nodemailer = require("nodemailer");
require("dotenv").config();
//^ DEFAULT API

let defaultRoute = async (req, res) => {
  res.send("Hello, Vercel!");
};

//^ POST CONTACT API = TO POST THE CONTACT INFO
let contactApi = async (req, res, next) => {
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
        user: "nidhi15sak@gmail.com",
        pass: "ngaejxlsadnhqbac",
      },
      debug: true,
    });
    let contactMail = async () => {
      await transporter.sendMail({
        from: email,
        to: "nidhi15sak@gmail.com",
        subject: "New Contact Form Submission",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007BFF;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; color: #555;">
            ${message}
          </blockquote>
          <p style="margin-top: 20px; color: #777;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
      });
    };
    contactMail(email);
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
