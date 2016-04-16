'use strict';

const db = require('./database');
const Joi = require('joi');
const util = require('./util');

const fns = {};

const validation = {};

validation.locationsNearby = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    maxDistance: Joi.number(),
    limit: Joi.number(),
    locationName: Joi.string()

});

fns.getLocationsNearby = (requestData, done) => {
    Joi.validate(requestData.data, validation.locationsNearby, (err, data) => {

        if (err) {
            return util.validationError(err, 'location get service', done);
        }
        let distance = data.maxDistance || 1;
        db.findDataNearby('locations', data.long, data.lat, {
                maxDistance: distance / 6371,
                limit: data.limit || 10
            })
            .then(data => {
                done(null, {data: data.results});
            })
            .catch(err => util.serviceError(err, 'location get nearby service', done));
    });


};

module.exports = fns;
