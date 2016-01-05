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

fns.toggleFavorLocation = (requestData, next) => {
    Joi.validate(requestData.data, validation.favorLocation, (err, validatedData) => {
        if (err) {
            return next(err);
        }

        return db.hasUserLocationFavored(validatedData.location_id, validatedData.user_id)
            .then(hasFavored => {
                return db.updateFavor(validatedData.location_id, validatedData.user_id, hasFavored)
                    .then(res => {
                        let ofc = res.value.favorites.length;
                        let nfc = hasFavored ? ofc - 1 : ofc + 1;
                        return {
                            favorites: nfc,
                            added: !hasFavored,
                            removed: hasFavored
                        }
                    });
            })
            .then(res => next(null, res))
            .catch(next);

    });
};

module.exports = fns;