'use strict';

const { body, validationResult } = require('express-validator')

function getErrorMessage (req) {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        let errerArray = errors.array();
        return errerArray.reduce((message, error) => {
            return message + error.msg +  '<br>';
        }, '');
    }
    return null;
}

module.exports = {body, getErrorMessage};