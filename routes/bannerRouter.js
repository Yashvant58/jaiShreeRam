const express = require('express');
const router = express.Router();
const { uploadBanner } = require('../controllers/banner');
const userTokenMiddleware = require('../middleware/user_token');
const upload = require('../config/bannerConfig');  // Import the multer configuration for uploading
const { getBanners } = require('../controllers/banner'); // Import the getBanners controller

// POST: Upload banner (type: spotlight, topPlans, bestOffers)
router.post('/addBanner', upload.single('image'), uploadBanner);


// Route to get all banners (spotlight, topPlans, bestOffers)
router.get('/getBanners', getBanners);
// Route to get all categories
// router.get('/getBanner', getBanner);
// Protected route example (you can create any protected routes)






router.get('/dashboard',
  //  userTokenMiddleware, 
   (req, res) => {
  res.json({ message: `Welcome to the dashboard,` });
});

module.exports = router;
