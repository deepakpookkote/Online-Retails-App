const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).populate('category');
        if (!product) {
            return res.status(400).json({
                error: 'no products found'
            });
        }
        req.product = product;
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'something went wrong while fetching the product'
        })
    }
};


exports.addProduct = (req, res) => {
    let productForm = new formidable.IncomingForm();
    productForm.keepExtensions = true;

    productForm.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'there is some issue with image you are uploading'
            });
        }

        //destructuring here field values.

        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: 'Please include all fields'
            });
        }

        let product = new Product(fields);
        //handling image files here

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'file size exceeds the limitation'
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: 'Adding file into the db failed'
                });
            }
            product.photo = undefined;
            res.status(200).json(product);
        })
    })
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    res.status(200).json(req.product);
};

//middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = async (req, res) => {
    let product = req.product;
    try {
        const deletedProduct = await product.remove();

        if (!deletedProduct) {
            return res.status(400).json({
                error: 'failed to find the product'
            });
        }

        res.status(200).json({
            message: 'success',
            product: deletedProduct
        });

    } catch (error) {
        return res.status(500).json({
            error: 'something went wrong while fetching the product'
        })
    }
}

exports.updateProduct = (req, res) => {
    let productForm = new formidable.IncomingForm();
    productForm.keepExtensions = true;

    productForm.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'there is some issue with image you are uploading'
            });
        }
        //updating code
        let product = req.product;
        product = _.extend(product, fields)

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'file size exceeds the limitation'
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: 'Updating file into the db failed'
                });
            }
            product.photo = undefined;
            res.status(200).json(product);
        })
    })
};

exports.getAllProducts = async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit): 10;
    let sortBy = req.query.sortBy ? req.query.sortBy: "_id";
    try {
        const products = await Product.find()
            .select("-photo")
            .sort([[sortBy, "asc"]])
            .populate("category")
            .limit(limit)

        if(!products) {
            return res.status(400).json({
                error: 'there are not products to show'
            });
        }
        res.status(200).json({
            message: 'success',
            products: products
        });

    } catch (error) {
        return res.status(500).json({
            error: 'something went wrong while fetching the product'
        })
    }
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (error, products) => {
        if(error) {
            return res.status(400).json({
                error: 'no category products to show'
            });
        }
        next();
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err) {
            return res.status(400).json({
                error: 'bulk operations failed'
            });
        }

        res.status(200).json({
            message: 'success',
            category: category
        });
    })
};

