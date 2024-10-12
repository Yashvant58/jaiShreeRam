
const Category = require('../../model/subCategorySchema');
const { categoryValidation } = require('../../validation/subCategoryValidation');
const fs = require('fs');
const path = require('path');

// Create a new category
exports.createSubCategory = async (req, res) => {
    
    
    const { error } = categoryValidation.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }

    try {
        const categoryPhotoPath = req.file ? `${process.env.host_name}/images/${req.file.filename}` : null;

        const newCategory = new Category({
            ...req.body,
            category_photo: categoryPhotoPath
        });

        const savedCategory = await newCategory.save();
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: savedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
};

// Get all categories with pagination and search (by name or category)
exports.getSubCategories = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    try {
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        };

        const categories = await Category.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        const totalCategories = await Category.countDocuments(query);

        res.status(200).json({
            success: true,
            data: categories,
            totalPages: Math.ceil(totalCategories / limit),
            currentPage: parseInt(page),
            totalSubCategory:totalCategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

// Edit an existing category
exports.editSubCategory = async (req, res) => {
    const { categoryId } = req.params;
    console.log(categoryId,"categoryId")
    const { error } = categoryValidation.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }

    try {
    
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const categoryPhotoPath = req.file ? `${process.env.host_name}/images/${req.file.filename}` : existingCategory.category_photo;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { ...req.body, category_photo: categoryPhotoPath },
            { new: true }
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

// Delete a category
exports.deleteSubCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Optionally delete the category image from storage
        if (deletedCategory.category_photo) {
            const photoPath = path.join(__dirname, '../../public/images', deletedCategory.category_photo.split('/').pop());
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath); // Remove the image file
            }
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message
        });
    }
};
