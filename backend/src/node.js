// sending verifying code


const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files like HTML

// Temporary storage for verification codes
const userVerification = {};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your_email@gmail.com", // Your email
    pass: "your_password",        // Your email password
  },
});

// Forgot password route
app.post("/reset-password", (req, res) => {
  const { email } = req.body;

  // Generate a verification code
  const verificationCode = crypto.randomBytes(3).toString("hex");
  userVerification[email] = verificationCode;

  // Send email
  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Password Reset Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("Error sending email.");
    } else {
      console.log("Email sent: " + info.response);
      res.redirect("/reset.html"); // Redirect to reset page
    }
  });
});

// Verify code and reset password route
app.post("/verify-code", (req, res) => {
  const { email, code, newPassword } = req.body;

  if (userVerification[email] === code) {
    delete userVerification[email]; // Clear the code
    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    res.send("Password successfully reset!");
  } else {
    res.send("Invalid verification code.");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
