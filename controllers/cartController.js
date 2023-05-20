'use strict';

let models = require('../models');
let controller = {};

controller.show = async (req, res, next) => {
    res.locals.cart = req.session.cart.getCart();
    return res.render('cart');
}

controller.add = async (req, res) => {
    let id = isNaN(req.body.id) ? 0 : parseInt(req.body.id);
    let quantity = isNaN(req.body.quantity) ? 0 : parseInt(req.body.quantity);

    let product = await models.Product.findByPk(id);

    if(product) {
        req.session.cart.add(product, quantity);
    }
    return res.json({
        quantity: req.session.cart.quantity
    });
}

module.exports = controller;