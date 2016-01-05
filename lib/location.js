'use strict';

const db = require('./database');
const validation = require('./validation');

const Joi = require('joi');

const fns = {};

fns.getLocationById = (requestData, done) => {

    if (!requestData.data || !requestData.data.locationId) {
        return done(new Error('missing location id'));
    }

    db.genericById(requestData.data.locationId, 'locations')
        .then(data => {
            done(null, data);
        })
        .catch(done);

};

fns.favorLocation = (requestData, next) => {
    Joi.validate(requestData.data, validation.favorLocation, (err, validatedData) => {
        if (err) {
            return next(err);
        }

        return db.hasUserLocationFavored(validatedData.location_id, validatedData.user_id)
            .then(hasFavored => db.updateFavor(validatedData.location_id, validatedData.user_id, hasFavored))
            .then(res => next(null, res.value))
            .catch(next);

    });
};

module.exports = fns;