const Category = require('../../model/categorySchema');
const { categoryValidation } = require('../../validation/catagoryValidation'); // Import the validation schema
const path=require('path');
const fs=require('fs');
// Controller to create a new category with image upload
exports.createCategory = async (req, res) => {
    // Validate request body (without image)
    const { error } = categoryValidation.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }

    try {
        // Check if the category_name already exists
        const existingCategory = await Category.findOne({ category_name: req.body.category_name });
        if (existingCategory) {
            return res.status(400).json({
                status: "002",  // Your custom status for this specific error
                success: false,
                message: 'This category is already available. Cannot create the same category again.'
            });
        }

        // Set category image path if file is uploaded
        const categoryImagePath = req.file ? `${process.env.host_name}/images/${req.file.filename}` : null;

        // Create a new category
        const newCategory = new Category({
            category_name: req.body.category_name,
            category_screen: req.body.category_screen,
            category_image: categoryImagePath
        });

        // Save the new category
        const savedCategory = await newCategory.save();

        // Respond with success
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: savedCategory
        });
    } catch (error) {
        // Handle errors during category creation
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
};

// Controller to get all categories with pagination and search
exports.getCategory = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query; // Destructure query parameters

        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber; // Calculate the number of records to skip

        // Construct the search query
        const searchQuery = search ? { category_name: { $regex: search, $options: 'i' } } : {};

        // Get total count of categories for pagination
        const totalCategories = await Category.countDocuments(searchQuery);

        // Fetch categories based on the pagination and search
        const categories = await Category.find(searchQuery)
            .skip(skip)
            .limit(limitNumber)
            .sort({ created_at: -1 }); // Sort by created_at in descending order

        res.status(200).json({
            success: true,
            data: categories,
            total: totalCategories,
            page: pageNumber,
            totalPages: Math.ceil(totalCategories / limitNumber)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve categories',
            error: error.message
        });
    }
};
// Controller to edit an existing category

// Controller to edit an existing category
exports.editCategory = async (req, res) => {
    const { categoryId } = req.params; // Get category ID from URL parameters

    // Validate request body (excluding image)
    const { error } = categoryValidation.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }

    try {
        // Find the existing category
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Set the new category image path if a new file is uploaded
        let categoryImagePath = existingCategory.category_image; // Keep the old image by default
        if (req.file) {
            // Delete the old image file if it exists
            const oldImagePath = path.join(__dirname, '../../public/images', existingCategory.category_image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Remove the old image file
            }

            // Update with the new image path
            categoryImagePath = `${process.env.host_name}/images/${req.file.filename}`;
        }

        // Update category fields
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                category_name: req.body.category_name,
                category_image: categoryImagePath
            },
            { new: true } // Return the updated category
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error.message
        });
    }
};
// Controller to delete a category
exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params; // Get category ID from URL parameters

    try {
        // Find and delete the category
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        // Check if category was found
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: deletedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message
        });
    }
};


