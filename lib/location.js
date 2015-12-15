'use strict';

const db = require('./database');

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

module.exports = fns;