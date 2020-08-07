const User = require('../models/user');
const Category = require('../models/category');

const { validationResult } = require('express-validator')


exports.getCategoryById = async (req, res, next, id) => {
    try {
        const categoryList = await Category.findById(id);

        if (!categoryList) {
            return res, status(400).json({
                error: 'Category not find in the DB'
            });
        }
        req.category = categoryList;
        next();
    } catch (error) {
        return res.status(500).json('something went wrong');
    }

};

exports.createCategory = async (req, res) => {

    const categoryErrors = validationResult(req);

    if (!categoryErrors.isEmpty()) {
        return res.status(422).json({
            error: categoryErrors.array()[0].msg,
            params: categoryErrors.array()[0].param
        });
    }
    const category = new Category(req.body);
    try {
        const result = await category.save();
        res.status(200).json({
            message: 'success',
            category: result
        })

    } catch (error) {
        return res.status(500).json('something went wrong while saving category');
    }
};

exports.getCategory = async (req, res) => {
    return res.json(req.category)
};

exports.getAllCategories = async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (!categoryList) {
            return res, status(400).json({
                error: 'No categories found in the db'
            });
        }
        res.status(200).json({
            message: 'success',
            categoryList: categoryList
        });
    } catch (error) {
        return res.status(500).json('something went wrong while fetching al categories');
    }
};

exports.updateSelectedCategory = async (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    try {
        const result = await category.save();
        if (!result) {
            return res, status(400).json({
                error: 'Failed to update category'
            });
        }
        res.status(200).json({
            message: 'success',
            category: result
        })
    } catch (error) {
        return res.status(500).json(error, 'something went wrong while updating category');
    }
};

exports.deleteCategoryById = async (req, res) => {
    const category = req.category;
    try {
        const result = await category.remove();
        if (!result) {
            return res, status(400).json({
                error: 'Failed to delete category'
            });
        }
        res.status(200).json({
            message: 'success',
        });

    } catch (error) {
        return res.status(500).json(error, 'something went wrong while updating category');
    }

}

