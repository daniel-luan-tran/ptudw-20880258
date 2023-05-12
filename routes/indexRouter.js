'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController');

router.get('/', (req, res) => {
    controller.showHomePage(req, res);
});

router.get('/:page', (req, res) => {
    controller.showPage(req, res);
});

module.exports = router;