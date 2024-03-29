'use strict';

const controller = {};
const models = require('../models');

controller.showHomePage = async (req, res) => {
    console.log("Home page");

    const recentProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        order: [['createdAt', 'DESC']],
        limit: 10
    });
    res.locals.recentProducts = recentProducts;

    const featuredProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        order: [['stars', 'DESC']],
        limit: 10
    });
    res.locals.featuredProducts = featuredProducts;

    const categories = await models.Category;
    // console.log(categories);
    const _categories = await categories.findAll();
    // console.log(_categories);
    const secondArray = _categories.splice(2, 2);
    const thirdArray = _categories.splice(1, 1);
    res.locals.categoriesArray = [
        _categories,
        secondArray,
        thirdArray,
    ]
    const brands = models.Brand;
    const _brands = await brands.findAll();
    res.render('index', { _brands });
};

controller.showPage = (req, res, next) => {
    const page = ['cart', 'checkout', 'contact', 'login', 'my-account', 'product-detail', 'product-list', 'wishlist', 'index'];
    if (page.includes(req.params.page))
        return res.render(req.params.page);
    next();
};

module.exports = controller;