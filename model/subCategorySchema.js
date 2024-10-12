// models/categorySchema.js

const mongoose = require('mongoose');
const moment = require('moment-timezone');

const subCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    designation: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category', // Reference another category schema if needed
    },
    url: {
        type: String,
        required: false,
        default: null,
    },
    subCategory_image: {
        type: String, // Store image URL
        required: false,
    },
    whatsapp_number: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please fill a valid WhatsApp number'],
    },
    createdAt: { type: String, default: null },                    // Optional and null by default
    updatedAt: { type: String, default: null }                     // Optional and null by default
  });
  
  // Pre-save hook to set the correct timezone for createdAt and updatedAt as strings
  subCategorySchema.pre('save', function (next) {
    const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  
    if (!this.createdAt) {
      this.createdAt = now;
    }
  
    this.updatedAt = now;
    next();
  });
  
  // Pre-update hook to ensure updatedAt is also set in the correct timezone on updates
  subCategorySchema.pre('findOneAndUpdate', function (next) {
    const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    this._update.updatedAt = now;
    next();
  });

module.exports = mongoose.model('subCategory', subCategorySchema);
