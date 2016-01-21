'use strict';

const Joi = require('joi');

const validations = {};

validations.mongoId = Joi.string().optional();
validations.mongoIdRequired = Joi.string().required();

let basicDataWithUserData = Joi.object().keys({
    user_id: validations.mongoIdRequired
});

validations.favorLocation = basicDataWithUserData.keys({
    location_id: validations.mongoIdRequired
});

validations.schoenhier = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    userid: Joi.string().optional()
});

validations.schoenhierNearby = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    maxDistance: Joi.number().default(10),
    limit: Joi.number()
});



module.exports = validations;