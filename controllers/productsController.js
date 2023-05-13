'use strict';

const controller = {};
const models = require('../models');

controller.show = async (req, res) => {
    let categoryId = parseInt(req.query.categoryId) || 0;
    let brandId = parseInt(req.query.brandId) || 0;
    let brands = await models.Brand.findAll({
        include: [{
            model: models.Product
        }]
    });
    
    let categories = await models.Category.findAll({
        include: [{
            model: models.Product
        }]
    });

    let productsOption = {
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'categoryId'],
        where: {},
        include: [{
            model: models.Category,
            attributes: ['name']
        }]
    }

    if (categoryId != 0) productsOption.where.categoryId = categoryId;
    
    if (brandId!= 0) productsOption.where.brandId = brandId;

    let products = await models.Product.findAll(productsOption);

    res.locals.categories = categories;
    res.locals.brands = brands;
    console.log(categories);
    res.locals.products = products;
    console.log('render product-list');
    res.render('product-list');
};

module.exports = controller;