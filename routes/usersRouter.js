'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

const { body, validationResult } = require('express-validator');

router.get('/checkout', controller.checkout);

router.post('/placeorders', 
    body('firstName').notEmpty().withMessage('First name is required!'),
    body('lastName').notEmpty().withMessage('Last name is required!'),
    body('email').notEmpty().withMessage('Email is required!').isEmail().withMessage('Please enter a valid email!'),
    body('mobile').notEmpty().withMessage('Mobile is required!'),
    body('address').notEmpty().withMessage('Address is required!'),
    (req, res, next) => {
        if(req.body.addressId == 0) {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                let errorArray = errors.array();
                let errorMessage = '';
                errorArray.forEach((er) => errorMessage += `${er.msg}<br>`);
                return res.render('error', { message: errorMessage});
            }
        }
        next();
    },
    controller.placeorders
);

router.get('/my-account', (req, res) => {
    res.render('my-account');
});

router.get('/wishlist', (req, res) => {
    res.render('wishlist');
});

module.exports = router;