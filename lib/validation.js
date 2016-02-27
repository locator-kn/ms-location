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


validations.getLocationById = Joi.object({
    locationId: validations.mongoIdRequired
});

validations.impression = Joi.object({
    user_id: validations.mongoIdRequired,
    location_id: validations.mongoIdRequired,
    file: Joi.object().keys({
        id: validations.mongoIdRequired,
        name: Joi.string().required()
    })
});

validations.locByName = Joi.object({
locationName: Joi.string()
});

module.exports = validations;
