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
    // console.log("Headers:", req.headers);
    // console.log("Raw Body:", req.body);
    // console.log("Content Type:", req.headers['content-type']);

    const { name, email, message } = req.body;
    
    // More detailed validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: true, 
        message: "Request body is missing or empty",
        receivedHeaders: req.headers,
        receivedBody: req.body
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: true, 
        message: "All fields are required",
        received: { name, email, message } // Show what was received
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: "Invalid email format"
      });
    }

    // Create contact entry with error handling
    let contactEntry;
    try {
      contactEntry = await contactData.create({
        name,
        email,
        message,
      });
    } catch (dbError) {
      // console.error("Database Error:", dbError);
      return res.status(500).json({
        error: true,
        message: "Failed to save contact information"
      });
    }

    // More secure email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Add more detailed error logging
    try {
      await transporter.verify();
    } catch (emailError) {
      console.error("Email Configuration Error Details:", emailError);
      return res.status(500).json({
        error: true,
        message: "Email service configuration error",
        details: emailError.message
      });
    }

    // Send emails with separate try-catch
    try {
      // Send to admin
      await transporter.sendMail({
        from: `"Contact Form" <${process.env.EMAIL_USER || "nidhi15sak@gmail.com"}>`,
        to: process.env.EMAIL_USER || "nidhi15sak@gmail.com",
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
          </div>
        `,
      });

      // Send to user
      await transporter.sendMail({
        from: `"Nidhi" <${process.env.EMAIL_USER || "nidhi15sak@gmail.com"}>`,
        to: email,
        subject: "Thank you for contacting me",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007BFF;">Thank you for reaching out!</h2>
            <p>Dear ${name},</p>
            <p>I have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br/>Nidhi</p>
          </div>
        `,
      });
    } catch (emailSendError) {
      // console.error("Email Sending Error:", emailSendError);
      return res.status(500).json({
        error: true,
        message: "Failed to send emails",
        details: emailSendError.message
      });
    }

    res.status(201).json({
      error: false,
      message: "I have received your mail, I'll get back to you soon",
      data: contactEntry,
    });
  } catch (error) {
    // console.error("Contact API Error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to process contact form",
      details: error.message
    });
  }
};

module.exports = {
  defaultRoute,
  contactApi,
};
