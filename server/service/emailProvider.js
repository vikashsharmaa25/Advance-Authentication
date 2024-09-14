const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpToEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, // Use the passed email here
      subject: "YOUR EMAIL VERIFICATION OTP",
      text: `Your OTP is: ${otp}. It will expire after 10 minutes.`,
      html: `<b>Your OTP is: ${otp}. It will expire after 10 minutes.</b>`, // Properly close the HTML tag
    });

    console.log("Message sent: ", info.messageId);
    return info;
  } catch (error) {
    console.log("Something went wrong while sending the OTP.");
    throw new Error(error.message);
  }
};

module.exports = sendOtpToEmail;
