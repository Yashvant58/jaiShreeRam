const express = require('express');
const router = express.Router();
const { getAllCategories,getCategoriesByScreenAndAll} = require('../controllers/category');
const {getSubCategories}=require("../controllers/category")
const userTokenMiddleware = require('../middleware/user_token');


// Route to get all categories
router.get('/categories/Others', getAllCategories);
// Protected route example (you can create any protected routes)

router.get('/categories/Home', getCategoriesByScreenAndAll);

// subcategory routes
router.get('/subCategories/MainScreen', getSubCategories);





module.exports = router;
