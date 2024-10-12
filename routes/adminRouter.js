const express = require('express');
const router = express.Router();
const adminTokenMiddleware = require('../middleware/admin_token');
const upload = require('../config/uploadConfig'); // Import the multer config
const { register, login, changePassword,getAllUsers,logout } = require('../controllers/admin/admin');
const {
    createCategory,
    getCategory,
    editCategory,
    deleteCategory
} = require('../controllers/admin/category');

const {
    createSubCategory,
    getSubCategories,
    editSubCategory,
    deleteSubCategory
} = require('../controllers/admin/subCategory');

// Route to create a new category with image upload
router.post('/categories',adminTokenMiddleware, upload.single('category_image'), createCategory);

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Change password route
router.post('/change-password',adminTokenMiddleware, changePassword);

// logout 
router.post('/logout',adminTokenMiddleware, logout);

// get all users
router.get('/getAllUsers',adminTokenMiddleware,getAllUsers)

// get all Category
router.get('/Category',adminTokenMiddleware,getCategory)

// Route to edit an existing category
router.put('/Category/:categoryId',adminTokenMiddleware,upload.single('category_image'), editCategory); // Edit by ID

// Route to delete a category
router.delete('/Category/:categoryId',adminTokenMiddleware, deleteCategory); // Delete by ID

///////////////subcategory route///////////////



// Route to create a category with image upload
router.post('/createSubcategory',adminTokenMiddleware, upload.single("subCategory_image"), createSubCategory);

// Route to get all categories with pagination and search
router.get('/subCategory',adminTokenMiddleware, getSubCategories);

// Route to edit an existing category with image upload
router.put('/subCategory/:categoryId',adminTokenMiddleware, upload.single("subCategory_image"), editSubCategory);

// Route to delete a category by ID
router.delete('/subCategory/:categoryId',adminTokenMiddleware, deleteSubCategory);


module.exports = router;
