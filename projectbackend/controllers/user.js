const User = require('../models/user');
const Order = require('../models/order');

exports.getUserById = async (req, res, next, id) => {
    try {
        user = await User.findById(id).exec();
        if (!user) {
            return res.status(422).json({
                message: 'User Not Found!!'
            })
        }
        req.profile = user;
        next();

    } catch (error) {
        return res.status(500).json('something went wrong');
    }
};

exports.getUser = (req, res, next) => {
    //get back here for password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if(!users) {
            return res.status(422).json({
                message: 'no users found'
            })
        }
        res.status(200).json({
            message: 'success',
            users: users
        });
    } catch(error) {
        return res.status(500).json('something went wrong');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            {_id: req.profile._id},
            {$set: req.body},
            {new: true, useFindAndModify: false}
        );

        if(!user) {
            return res.status(400).json({
                message: 'you are not authorized to update the user'
            });
        }
        user.salt = undefined;
        user.encry_password = undefined;
        res.status(200).json({
            message: 'success',
            user: user
        });

    } catch(error) {
        return res.status(500).json('something went wrong in modification of user');
    }
};

exports.userPurchaseLit = async (req, res) => {
    const order = await Order.find({user: req.profile._id}).populate('user', "_id name email");

    if(!order) {
        return res.status(400).json({
            message: 'No orders to display in this account'
        });
    }

    res.status(200).json({
        order: order
    });
};

exports.pushOrderInPurchaseList = async (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });
    //store this in db
    const purchaseList = await User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true}
    );

    if(!purchaseList) {
        return res.status(400).json({
            message: 'Unable to save purchase list'
        });
    }
    next();
}