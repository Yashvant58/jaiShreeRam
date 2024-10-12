const mongoose = require('mongoose');
const moment = require('moment-timezone');

let categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true },               // Category name, required field
  category_screen: { type: String, required: true },               // Category name, required field
  category_image: { type: String, required: true},          // Path to the category image, optional
  createdAt: { type: String, default: null },                    // Optional and null by default
  updatedAt: { type: String, default: null }                     // Optional and null by default
});

// Pre-save hook to set the correct timezone for createdAt and updatedAt as strings
categorySchema.pre('save', function (next) {
  const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

// Pre-update hook to ensure updatedAt is also set in the correct timezone on updates
categorySchema.pre('findOneAndUpdate', function (next) {
  const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  this._update.updatedAt = now;
  next();
});

module.exports = mongoose.model('Category', categorySchema);
