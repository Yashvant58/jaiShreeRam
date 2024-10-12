// models/cityModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  },
  country: {
    type: String,
    required: true,
    trim: true
  },

});

const City = mongoose.model('City', citySchema);
module.exports = City;
