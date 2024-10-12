const User = require('../../model/adminSchema');
const userSchema=require("../../model/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, changePasswordValidation } = require('../../validation/adminValidation');

// Register function
const register = async (req, res) => {
    // Validate request
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ status: "002", message: error.details[0].message });

    // Check if the user already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json({ status: "002", message: 'Email already exists.' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.json({ status: "001", message: "Admin Registered Successfully." });
    } catch (err) {
        res.status(400).json({ status: "002", message: err.message });
    }
};

// Login function
const login = async (req, res) => {
    try {
        // Validate request
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).json({ status: "002", message: error.details[0].message });

        // Check if the user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ status: "002", message: 'Email or password is wrong.' });

        // Check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json({ status: "002", message: 'Invalid password.' });

        // Check if there's already an active session for the user
        if (user.token) {
            // Optionally log out previous session by clearing old token
            user.token = null;
            await user.save(); // Save the user after removing the old token
        }

        // Create and assign a token without expiration
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        // Save the new token to the user record
        user.token = token;
        await user.save(); // Save the user with the new token

        // Send the token in the response and header
        res.header('auth-token', token);
        res.json({
            status: "001",
            message: "Admin Login Successfully.",
            token: token
        });

    } catch (err) {
        return res.status(500).json({ status: "002", message: "Something went wrong." });
    }
};

// Change Password function
const changePassword = async (req, res) => {
    try {
        // Validate request
        const { error } = changePasswordValidation(req.body);
        if (error) return res.status(400).json({ status: "002", message: error.details[0].message });

        // Check if the user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ status: "002", message: 'User not found.' });

        // Check if old password is correct
        const validPass = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!validPass) return res.status(400).json({ status: "002", message: 'Old password is incorrect.' });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

        // Update password
        user.password = hashedNewPassword;
        await user.save();
        res.json({ status: "001", message: 'Password updated successfully.' });

    } catch (err) {
        return res.status(500).json({ status: "002", message: "Something went wrong." });
    }
};


const logout = async (req, res) => {
    try {
        const { email } = req.body; // Assume email is being passed in the request body

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ status: "002", message: 'User not found.' });
        }

        // If user is found, clear the token (logout the user)
        user.token = null; // Clear the token

        // Save the updated user document
        await user.save();

        // Return a success response
        return res.status(200).json({
            status: "001",
            message: 'Admin logged out successfully.'
        });

    } catch (err) {
        return res.status(500).json({ status: "002", message: "Something went wrong." });
    }
};




// Get all users with pagination and search functionality
const getAllUsers = async (req, res) => {
    try {
        // Pagination parameters (defaults to page 1 and limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Search query (by default it's an empty object)
        const searchQuery = {};
        const { username, fullName, email, mobile, gender, age, address, bloodGroup, profession, insuranceType, insuranceCompany } = req.query;

        // Add search conditions for each field, only if a query parameter is provided
        if (username) searchQuery.username = { $regex: username, $options: 'i' };
        if (fullName) searchQuery.fullName = { $regex: fullName, $options: 'i' };
        if (email) searchQuery.email = { $regex: email, $options: 'i' };
        if (mobile) searchQuery.mobile = { $regex: mobile, $options: 'i' };
        if (gender) searchQuery.gender = gender;
        if (age) searchQuery.age = age;
        if (address) searchQuery.address = { $regex: address, $options: 'i' };
        if (bloodGroup) searchQuery.bloodGroup = bloodGroup;
        if (profession) searchQuery.profession = { $regex: profession, $options: 'i' };
        if (insuranceType) searchQuery.insuranceType = { $regex: insuranceType, $options: 'i' };
        if (insuranceCompany) searchQuery.insuranceCompany = { $regex: insuranceCompany, $options: 'i' };

        // Fetch users with pagination and search query
        const users = await userSchema.find(searchQuery)
            .select('-tokens -otp -expires_in -__v') // Exclude otp, expires_in, tokens, and __v fields
            .skip((page - 1) * limit)
            .limit(limit);

        // Get the total count of users (for pagination)
        const totalUsers = await userSchema.countDocuments(searchQuery);

        res.json({
            status: "001",
            message: "Users retrieved successfully",
            data: users,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                limit: limit
            }
        });
    } catch (err) {
        res.status(500).json({ status: "002", message: "Something went wrong", error: err.message });
    }
};




module.exports = { register, login, changePassword,getAllUsers,logout };
