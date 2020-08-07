const { Order, ProductCart } = require('../models/order');

exports.getOrderById = async (req, res, next, id) => {
    try {
        const order = await Order.findById(id).populate("products.product", "name price");
        if (!order) {
            return res.status(400).json({
                error: 'no orders found'
            });
        }
        req.order = order;
        next()
    } catch (error) {
        return res.status(500).json({
            error: 'something went wrong while fetching the order'
        })
    }
};


exports.createOrder = async (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    try {
        await order.save();
        res.status(200).json(order);

    } catch (error) {
        return res.status(500).json({
            message: 'something went wrong while creating the order',
            error: error
        })
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "_id name email");
        if(!orders) {
            return res.status(400).json({
                error: 'no orders found'
            });
        }
        res.status(200).json(orders);


    } catch (error) {
        return res.status(500).json({
            message: 'error while fetching all orders',
            error: error
        })
    }
};

exports.updateStatus = (req, res) => {
    res.status(200).json(Order.schema.path("status").enumValues);
};

exports.getOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err) {
                return res.status(400).json({
                    message: 'cannot update order status',
                    error: err
                });
            }
            res.status(200).json(order);
        }
    )
};

