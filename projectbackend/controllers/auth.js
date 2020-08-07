const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cookie = require('cookie-parser');
const User = require('../models/user');
const { validationResult } = require('express-validator');


//middleware - protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom-middleware
exports.isAuthenticated = (req, res, next) => {
    let authChecker = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();
    if (!authChecker) {
        return res.status(403).json({
            error: 'Access Denied'
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'You are not admin, access denied'
        });
    }
    next();
}



exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: 'user logged out successfully'
    });
};

exports.signup = async (req, res) => {
    const signupErrors = validationResult(req);

    if (!signupErrors.isEmpty()) {
        return res.status(422).json({
            error: signupErrors.array()[0].msg,
            params: signupErrors.array()[0].param
        });
    }
    const user = new User(req.body);
    try {
        await user.save();
        res.json({
            message: 'success',
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Not able to save user in db'
        })
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    const signInErrors = validationResult(req);
    if (!signInErrors.isEmpty()) {
        return res.status(422).json({
            error: signInErrors.array()[0].msg,
            params: signInErrors.array()[0].param
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(422).json({
                message: 'User Not Found!!'
            })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                message: 'Email and password does not match'
            });
        }
        //create a token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });
        return res.status(200).json({
            message: 'success',
            token: token,
            user:
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'error-something went wrong' });
    }

};