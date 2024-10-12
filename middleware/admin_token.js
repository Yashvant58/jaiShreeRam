const jwt = require('jsonwebtoken');
const User = require('../model/adminSchema'); // Import your User model
require('dotenv').config();


const adminTokenMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ status: "003", message: 'Access Denied: No token provided' });
    }

    // Split "Bearer token" and extract the token
    token = token.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: "003", message: 'Access Denied: Token missing' });
    }

    // Verify the JWT token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified; // Attach user data to the request

    // Find user by ID and check if token matches the one stored in the database
    const user = await User.findOne({ _id: req.user._id, token: token });

    if (!user) {
      // If no matching user or token found, return logout error message
      return res.status(401).json({ status: "003", message: 'You are logged out. Please log in again.' });
    }

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // If JWT verification fails or other errors occur
    return res.status(400).json({ status: "003", message: 'Invalid or expired token' });
  }
};

module.exports = adminTokenMiddleware;
