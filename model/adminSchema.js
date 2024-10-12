const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String } // Token to store the current session's token
});

module.exports = mongoose.model('Admin', adminSchema);
