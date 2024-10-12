const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the banners directory exists, if not, create it
const bannersDirectory = './public/banners';
if (!fs.existsSync(bannersDirectory)) {
  fs.mkdirSync(bannersDirectory, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, bannersDirectory); // Store images in public/banners folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Create unique filename
  }
});

// Multer file filter for image validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
  cb(null, true);
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter
});

// Export the upload instance
module.exports = upload;
