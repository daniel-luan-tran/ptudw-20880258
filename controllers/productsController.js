'use strict';

const controller = {};
const models = require('../models');

controller.show = async (req, res) => {
    let products = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice']
    });

    res.locals.products = products;
    console.log('render product-list');
    res.render('product-list');
};

module.exports = controller;