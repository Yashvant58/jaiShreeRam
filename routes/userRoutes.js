const express = require('express');
const router = express.Router();
const { signup, login,verifyOtp,logout } = require('../controllers/userController');
const userTokenMiddleware = require('../middleware/user_token');


// User signup
router.post('/signup', signup);

// User login
router.get('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);

// Protected route example (you can create any protected routes)
router.get('/dashboard',
  //  userTokenMiddleware, 
   (req, res) => {
  res.json({ message: `Welcome to the dashboard,` });
});

module.exports = router;
