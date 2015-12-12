'use strict';

const db = require('./database');
const Joi = require('joi');

const fns = {};

const validation = {};

validation.locationsNearby = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    maxDistance: Joi.number(),
    limit: Joi.number()
});

fns.getLocationsNearby = (requestData, done) => {
    Joi.validate(requestData.data, validation.locationsNearby, (err, data) => {
        //let data = requestData.data;
        console.log(err, data);
        if (err) {
            return done(err);
        }
        db.findLocationsNearby(data.long, data.lat, {
                maxDistance: data.maxDistance,
                limit: data.limit || 10
            })
            .then(data => {
                done(null, data);
            })
            .catch(done);
    });


};

module.exports = fns;