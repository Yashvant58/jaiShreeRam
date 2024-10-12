const mongoose = require('mongoose');
const moment = require('moment-timezone');

let userSchema = new mongoose.Schema({
  username: { type: String, unique: true, },  // sparse allows multiple nulls
  fullName: { type: String, default: null },                // Optional and null by default
  otp: { type: String, default: null },                     // Optional and null by default
  expires_in: { type: String }, // Store the expiration time of the OTP
  email: { type: String, unique: true, sparse: true, default: null }, // Optional and null
  mobile: { type: String, unique: true, sparse: true, default: null }, // Optional and null
  tokens: [{
    token: { type: String, default: null }                   // Optional and null by default
  }],
  gender: { type: String, enum: ['Male', 'Female', 'Other', null], default: null }, // Optional and null
  age: { type: Number, min: 18, default: null },             // Optional and null by default
  address: { type: String, default: null },                  // Optional and null by default
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', null], default: null }, // Optional and null
  profession: { type: String, default: null },               // Optional and null by default
  hasInsurance: { type: String, default: "false" },          // Optional but defaults to "false"
  insuranceType: { type: String, default: "" },              // Optional and defaults to an empty string
  insuranceCompany: { type: String, default: "" },           // Optional and defaults to an empty string
  createdAt: { type: String, default: null },                // Optional and null by default
  updatedAt: { type: String, default: null }                 // Optional and null by default

});

// Pre-save hook to set the correct timezone for createdAt and updatedAt as strings
userSchema.pre('save', function (next) {
  const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

// Pre-update hook to ensure updatedAt is also set in the correct timezone on updates
userSchema.pre('findOneAndUpdate', function (next) {
  const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  this._update.updatedAt = now;
  next();
});

module.exports = mongoose.model('User', userSchema);
