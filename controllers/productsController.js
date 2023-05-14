'use strict';

const controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

controller.getData = async (req, res, next) => {
    let tags = await models.Tag.findAll({
        include: [{
            model: models.Product
        }]
    });

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

    res.locals.categories = categories;
    res.locals.brands = brands;
    res.locals.tags = tags;

    next();
}

controller.show = async (req, res) => {
    let categoryId = parseInt(req.query.categoryId) || 0;
    let brandId = parseInt(req.query.brandId) || 0;
    let tagId = parseInt(req.query.tagId) || 0;
    let keyword = req.query.keyword || "";
    let sort = ['price', 'newest', 'popular'].includes(req.query.sort) ? req.query.sort : "price";
    let page = Math.max(1, parseInt(req.query.page)) || 1;

    let productsOption = {
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'categoryId'],
        where: {},
        include: []
    }

    if (categoryId != 0) productsOption.where.categoryId = categoryId;
    
    if (brandId!= 0) productsOption.where.brandId = brandId;
    
    if (tagId!= 0) {
        productsOption.include = [{
            model: models.Tag,
            where: {id: tagId}
        }]
    }

    if (keyword.trim() != "") {
        productsOption.where.name = {
            [Op.iLike]: `%${keyword}%`
        }
    }

    switch (sort) {
        case "newest":
            productsOption.order = [['createdAt', 'DESC']]
            break;
            
        case "price":
            productsOption.order = [['price', 'DESC']]
            break;
            
        case "popular":
            productsOption.order = [['stars', 'DESC']]
            break;
    
        default:
            break;
    }

    res.locals.sort = sort;
    res.locals.originalUrl = removeParam('sort', req.originalUrl)

    //Pagination
    const limit = 6;
    productsOption.limit = limit;
    productsOption.offset = limit * (page - 1);

    let { rows, count} = await models.Product.findAndCountAll(productsOption);

    res.locals.pagination = {
        page: page,
        limit: limit,
        totalRows: count,
        queryParams: req.query
    }

    res.locals.products = rows;

    console.log('render product-list');
    res.render('product-list');
};

controller.showDetails = async (req, res) => {
    let id = parseInt(req.params.id);
    // let product = await models.Product.findByPk(id);
    let product = await models.Product.findOne({
        where: {id},
        include: [{
            model: models.Image,
        }, {
            model: models.Review,
            include: [{
                model: models.User
            }]
        },]
    });
    res.locals.product = product;
    res.render('product-detail');
}

module.exports = controller;