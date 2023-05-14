'use strict';

const controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

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

    let products = await models.Product.findAll(productsOption);

    res.locals.products = products;

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