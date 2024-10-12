const Category = require('../model/categorySchema');
const SubCategory =require('../model/subCategorySchema');
const {getSubCategories}=require("../validation/subCategoryValidation")
// after others
// Controller to get all category data
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch all categories from the database
        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

// for Home
// Controller to get all categories and categories where category_screen == 'Home'
exports.getCategoriesByScreenAndAll = async (req, res) => {
    try {

        // Fetch categories where category_screen is 'Home'
        const homeCategories = await Category.find({ category_screen: 'Home' });

        // Fetch all categories from the database
        const allCategories = await Category.find();

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: {
                homeCategories: homeCategories,   // Categories where category_screen == 'Home'
                allCategories: allCategories      // All categories
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};


// subCategory

// Get subcategories based on category_id, with pagination and optional search
exports.getSubCategories = async (req, res) => {
    const { page, limit , search = '', categoryID,city } = req.query;
    // Validate request query parameters
    const { error } = getSubCategories.validate(req.query);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }
    try {
        // Build the query for searching and filtering by categoryID
        const query = {
            $and: [
                { category_id: categoryID }, // Match the category_id provided in the request
                {city:city},
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } }, // Search in name
                        { category: { $regex: search, $options: 'i' } } // Search in category
                    ]
                }
            ]
        };

        // Fetch subcategories that match the query with pagination
        const categories = await SubCategory.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        // Get the total number of subcategories that match the query
        const totalCategories = await SubCategory.countDocuments(query);

        // Send the response
        res.status(200).json({
            success: true,
            data: categories,
            totalPages: Math.ceil(totalCategories / limit),
            currentPage: parseInt(page),
            totalSubCategory: totalCategories
        });
    } catch (error) {
        // Handle error
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};




