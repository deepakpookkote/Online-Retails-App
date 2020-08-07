const express = require('express');
const router = express.Router();

const { body } = require('express-validator')

const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const {
    getCategoryById,
    createCategory,
    getCategory,
    getAllCategories,
    updateSelectedCategory,
    deleteCategoryById
} = require('../controllers/category');


router.param('userId', getUserById);
router.param('categoryId', getCategoryById);


//routes
router.post('/category/create/:userId', [
    body('name', "category should be at least 5 characters and required").isLength({ min: 3 })

], isSignedIn, isAuthenticated, isAdmin, createCategory);

router.get('/category/:categoryId', getCategory);

router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateSelectedCategory);

router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteCategoryById);

router.get('/category', getAllCategories);








module.exports = router;