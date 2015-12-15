'use strict';

const db = require('./database');

const fns = {};

fns.getLocationById = (requestData, done) => {

    if (!requestData.locationId) {
        return done({message: 'missing location id'});
    }

    db.genericById(requestData.locationId, 'locations')
        .then(data => {
            done(null, data);
        })
        .catch(done);

};

module.exports = fns;