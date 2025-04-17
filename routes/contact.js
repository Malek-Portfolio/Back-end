const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});




router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const mailOptions = {
      from: email, 
      to: process.env.RECEIVER_EMAIL, 
      subject: `New contact form submission: ${subject}`,
      text: `📬 New message from your website:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
    };

    // Send email using nodemailer
    await transporter.sendMail(mailOptions);

    
    res.status(200).json({ success: true, message: "Form submitted and email sent successfully." });

  } catch (err) {
    
    console.error("Error sending email:", err.message);

    
    res.status(500).json({ success: false, message: "Internal server error. Email not sent.", error: err.message });
  }
});

module.exports = router;
