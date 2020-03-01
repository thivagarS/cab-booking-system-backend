const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.postSignupUser = (req, res, next) => {
    const { userName, email, phoneNumber, password, confirmPassword } = req.body;
    // validation
    User.findOne({ $or: [
        {
            "email": email
        },
        {
            "phoneNumber": phoneNumber
        }
    ]})
    .then(user => {
        if(user) {
            const error = new Error("User Account with same email or phone number exists");
            error.statusCode = 409;
            throw error;
        }
        if(password !== confirmPassword) {
            const error = new Error("Password doe not match");
            error.statusCode = 401;
            throw error;
        }
        return bcrypt.hash(password, 12) 
    })
    .then(hashedPassword => {
        const newUser = new User({
            userName,
            email,
            phoneNumber,
            password: hashedPassword
        })
        return newUser.save()
    })
    .then(user => {
        res.status(201).json({
            message: "Account created successfully"
        })
    })
    .catch(err =>{
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

module.exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    let loadedUser;
    User.findOne({email})
    .then(user => {
        if(!user) {
            const error = new Error("Email id and password does not match");
            error.statusCode = 404;
            throw error
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error("Email id and password does not match");
            error.statusCode = 404;
            throw error
        }
        const token = `Bearer ${jwt.sign(
            {
                email: loadedUser.email, 
                userId: loadedUser._id.toString()
            }, 'secert', {
                expiresIn: '1h'
            })}`;
        res.status(200).json({
            message: "User logged in successfully",
            token,
            expiresIn: 3600000,
            userName: loadedUser.userName
        })
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

module.exports.patchChangePassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    let loadedUser;
    User.findById(req.userId)
    .then(user => {
        if(!user) {
            const error = new Error("User does not exists");
            error.statusCode = 404;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(currentPassword, user.password)
    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error("Current Password is incorrect");
            error.statusCode = 404;
            throw error;
        }
        return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
        loadedUser.password = hashedPassword;
        return loadedUser.save()
    })
    .then(user => {
        res.status(200).json({
            message: "Password changed successfully"
        })
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}