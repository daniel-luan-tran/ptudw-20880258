'use strict';

const controller = {};
const models = require('../database/models');

controller.showHomePage = async (req, res) => {
    console.log("Home page");

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
    // console.log("brands", _brands);
    res.render('index', { _brands });
};

controller.showPage = (req, res) => {
    res.render(req.params.page);
};

module.exports = controller;