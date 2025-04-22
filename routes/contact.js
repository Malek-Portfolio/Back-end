const express = require("express");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});


const validateUserInput = [
  body("email")
  .trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email format")
  .normalizeEmail(),

  body("subject")
    .trim()
    .notEmpty().withMessage("Subject is required")
    .isLength({ max: 100 }).withMessage("Subject must be less than 100 characters"),

    body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 10, max: 1000 }).withMessage("Message must be 10-1000 characters")
]

const sanitizeInput = (value) => sanitizeHtml(value , {
  allowedTags : [],
  allowedAttributes : {}
})

const isMaliciousContent = (...values) => {
  const patterns = [
    /<script.*?>.*?<\/script>/gi,
    /javascript:/gi,
    /eval\(.*?\)/gi,
    /on\w+="[^"]*"/gi,
    /http(s)?:\/\//gi
  ];
  
  return values.some(value => 
    patterns.some(pattern => pattern.test(value))
  );
};

router.post("/", async (req, res) => {

  // validate input 
  const errors = validationResult(req)


  if (!errors) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  // Sanitize input 
  const name = sanitizeInput(req.body.name)
  const email = sanitizeInput(req.body.email)
  const subject = sanitizeInput(req.body.subject)
  const message = sanitizeInput(req.body.message)


  // check for malicious content
  if (isMaliciousContent(name , email , subject , message)) {
    console.warn(`Malicious attempt detected from IP: ${req.ip}`);
    return res.status(422).json({
      success: false,
      message: "Invalid message content detected"
    });
  }




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
})

module.exports = router;
