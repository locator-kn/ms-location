'use strict';

const db = require('./database');

const fns = {};

fns.getLocationsNearby = (data, done) => {
    if (!data) {
        return done({message: 'invalid arguments'});
    }

    db.findLocationsNearby(data.long, data.lat, data.options).then(data => {
        done(null, data);
    }).catch(done);
};

module.exports = fns;