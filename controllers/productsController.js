'use strict';

const controller = {};
const models = require('../models');

controller.show = async (req, res) => {
    let categoryId = parseInt(req.query.category) || 0;

    let categories = await models.Category.findAll({
        include: [{
            model: models.Product
        }]
    });

    let products = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'categoryId'],
        where: categoryId != 0 ? {categoryId: categoryId} : {},
        include: [{
            model: models.Category,
            attributes: ['name']
        }]
    });

    res.locals.categories = categories;
    console.log(categories);
    res.locals.products = products;
    console.log('render product-list');
    res.render('product-list');
};

module.exports = controller;