const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../model/userSchema');
const { signupValidation, loginValidation } = require('../validation/userValidation');
const { ErrorHandler, handleError } = require('../utils/errorHandler'); // Import custom error handler

// Environment variables for token secret
require('dotenv').config();


// User signup
exports.signup = async (req, res) => {
  // Validate the request body
  const { error } = signupValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { username, email, fullName, mobile, gender, age, address, bloodGroup, profession, hasInsurance, insuranceType, insuranceCompany } = req.body;

  try {
    // Find the user by email and update if exists, otherwise create a new one
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find the user by email
      { 
        $set: {
          username,
          fullName,
          mobile,
          gender,
          age,
          address,
          bloodGroup,
          profession,
          hasInsurance,
          insuranceType,
          insuranceCompany
        }
      },
      { new: true, upsert: true } // Return the updated user, or create if doesn't exist (upsert)
    );

    console.log("User updated or created successfully"); // For debugging
    return res.status(201).json({ success: true, message: 'User registered or updated successfully' });

  } catch (err) {
    console.error("Error during user update/create:", err); // Log the error for troubleshooting
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


exports.login = async (req, res, next) => {
  const { user_mail, username } = req.body; // Assuming username is being sent in the request

  // Validate request body
  const { error } = loginValidation.validate(req.body);
  if (error) {
      return next(new ErrorHandler(400, error.details[0].message)); // Pass validation error to next
  }

  // Check if the email exists
  let user = await User.findOne({ email: user_mail });

  // If email does not exist, create a new user
  if (!user) {

      user = new User({
          email: user_mail,
          username, // Ensure this field is populated
          // Add any other required fields for the User schema
      });

      // Save the new user to the database
      await user.save();
  }

  // Generate OTP
  function generateOTP() {
      const otpLength = 6;
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
      return otp.toString(); // Return OTP as string
  }

  const generatedOTP = generateOTP();
  const currentTimestamp = Date.now();
  const newTimestamp = currentTimestamp + 30 * 60 * 1000; // 30 minutes validity

  // Update OTP in the User collection
  const updatedUser = await User.findOneAndUpdate(
      { email: user_mail },
      { otp: generatedOTP, expires_in: newTimestamp }, // Update OTP and expiration time
      { new: true } // Return the updated document
  );

  // If the user was not found or update failed
  if (!updatedUser) {
      return next(new ErrorHandler(500, "Unable to update OTP")); // Pass server error
  }

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: "prajapatiyashvant746@gmail.com", // Replace with your email
          pass: "vqdw pmbl ehnh caid", // Replace with the actual password or app password
      },
  });

  // Setup mail options
  const mailOptions = {
      from: "prajapatiyashvant746@gmail.com", // Replace with your email
      to: user_mail, // Recipient email
      subject: "Jai Shree Ram Verification Code",
      text: `Dear User,

      Your OTP: ${generatedOTP}

      This OTP is valid for a short period and is intended for account verification purposes only.

      Thank you, The Jai Shree Ram Team`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(error);
          return next(new ErrorHandler(500, "Failed to send OTP")); // Pass email sending error
      } else {
          return res.status(200).json({ status: 1, message: `OTP sent to ${user_mail}` });
      }
  });
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the user exists and retrieve the OTP record
    const otpRecord = await User.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Check if OTP has expired
    if (Date.now() > otpRecord.expires_in) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    // If OTP is valid, generate a JWT token
    const token = jwt.sign({ email: otpRecord.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Push the new token into the tokens array for this specific user
    otpRecord.tokens.push({ token: token }); // Correctly push token object

    // Clear the OTP and expiration fields after successful verification
    // otpRecord.otp = undefined;
    // otpRecord.expires_in = undefined;

    // // Save the updated user document
    await otpRecord.save();
    console.log(otpRecord.mobile,"otpRecord")
    let user_data="Not Available";
  if(otpRecord.mobile){
    user_data="Available"
  }

    // Respond with success and the generated JWT token
    res.status(200).json({ message: 'OTP verified successfully.', token,user_data });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
};


// Logout controller
exports.logout = async (req, res, next) => {
  const { user_mail, token } = req.body; // Assume user_mail and token are being passed in request body

  try {
      // Find the user by email
      const user = await User.findOne({ email: user_mail });

      if (!user) {
          return next(new ErrorHandler(404, 'User not found')); // User not found
      }

      // Find and remove the token from the tokens array
      user.tokens = user.tokens.filter((t) => t.token !== token); // Remove the token

      // Optionally, invalidate OTP as well (if applicable)
      user.otp = null;
      user.expires_in = null;

      // Save the updated user data with the invalidated token
      await user.save();

      // Respond with a success message
      return res.status(200).json({
          status: 1,
          message: 'Logged out successfully',
      });
  } catch (error) {
      return next(new ErrorHandler(500, 'Failed to log out', error));
  }
};





