'use strict';

const db = require('./database');
const Joi = require('joi');

const fns = {};

const validation = {};

validation.locationsNearby = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    options: Joi.object()
});

fns.getLocationsNearby = (data, done) => {
    Joi.validate(data, validation.locationsNearby, (err, data) => {
        if(err) {
            return done(err);
        }
        db.findLocationsNearby(data.long, data.lat, data.options).then(data => {
            done(null, data);
        }).catch(done);
    });



};

module.exports = fns;