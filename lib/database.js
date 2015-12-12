'use strict';

const mongo = require('mongodb').MongoClient;

// TODO: read from env
const mongoUrl = 'mongodb://localhost:27017/locator';

const fns = {};
var database = {};

fns.findLocationsNearby = (long, lat, options) => {

    options.spherical = true;

    let collection = database.collection("locations");
    return collection.geoNear(long, lat, options);
};

/**
 * gets all users from the database
 * @param message - some param
 * @returns {*}
 */
fns.getAllUsers = (message) => {
    if (message.cmd !== 'test') {
        return Promise.reject({message: 'cmd was not test', code: 4000});
    }
    return Promise.resolve({doc: 'asd', processId: process.pid});
};

/**
 * connects to the database
 * @returns {Promise|*}
 */
fns.connect = () => {
    return mongo.connect(mongoUrl)
        .then(db => {
            database = db;
        });
};

module.exports = fns;