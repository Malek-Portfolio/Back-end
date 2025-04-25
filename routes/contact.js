const express = require("express");
const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const fetch = require("node-fetch");

const router = express.Router();


const sanitizeInput = (value) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });

const isMaliciousContent = (...values) => {
  const patterns = [
    /<script.*?>.*?<\/script>/gi,
    /javascript:/gi,
    /eval\(.*?\)/gi,
    /on\w+="[^"]*"/gi,
    /http(s)?:\/\//gi,
  ];

  return values.some((value) =>
    patterns.some((pattern) => pattern.test(value))
  );
};

router.post("/", async (req, res) => {
  // validate input
  const errors = validationResult(req);

  if (!errors) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  // Sanitize input
  const name = sanitizeInput(req.body.name);
  const email = sanitizeInput(req.body.email);
  const subject = sanitizeInput(req.body.subject);
  const message = sanitizeInput(req.body.message);

  // check for malicious content
  if (isMaliciousContent(name, email, subject, message)) {
    console.warn(`Malicious attempt detected from IP: ${req.ip}`);
    return res.status(422).json({
      success: false,
      message: "Invalid message content detected",
    });
  }

  const payload = {
    access_key: process.env.WEB3FORMS_KEY,
    name,
    email,
    subject,
    message,
  };

  try {
    const apiRes = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await apiRes.json();

    if (json.success) {
      return res
        .status(200)
        .json({ success: true, message: "Form submitted successfully." });
    } else {
      console.error("Web3Forms error:", json.message);
      return res.status(502).json({ success: false, error: json.message });
    }
  } catch (err) {
    console.error("Error sending email:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error. Email not sent.",
      error: err.message,
    });
  }
});

module.exports = router;
