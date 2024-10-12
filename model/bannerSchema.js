const mongoose = require('mongoose');
const moment = require('moment-timezone');

let bannerSchema = new mongoose.Schema({
  spotlightBanners: { type: String, default:null },               // Category name, required field
  topPlansBanners :{ type: String, default:null},          // Path to the category image, optional
  bestOffersBanners: { type: String, default:null},          // Path to the category image, optional
  createdAt: { type: String, default: null },                    // Optional and null by default
  updatedAt: { type: String, default: null }                     // Optional and null by default
});

// Pre-save hook to set the correct timezone for createdAt and updatedAt as strings
bannerSchema.pre('save', function (next) {
  const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

// Pre-update hook to ensure updatedAt is also set in the correct timezone on updates
bannerSchema.pre('findOneAndUpdate', function (next) {
  const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  this._update.updatedAt = now;
  next();
});

module.exports = mongoose.model('Banners', bannerSchema);
