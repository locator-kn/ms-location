'use strict';

const mongo = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://' + process.env['DB_HOST'] + ':' + process.env['DB_PORT'] + '/' + process.env['DB_NAME'];

const fns = {};
var database = {};

fns.findLocationsNearby = (long, lat, options) => {

    options.spherical = true;
    options.distanceMultiplier = 6371;

    let collection = database.collection("locations");
    return collection.geoNear(long, lat, options);
};

fns.addSchoenhier = (message) => {

    let collection = database.collection("schoenhiers");
    return collection.insertOne(message);
};

fns.getSchoenhiersNearby = (long, lat, options) => {

    options.spherical = true;
    options.distanceMultiplier = 6371;

    let collection = database.collection("schoenhiers");
    return collection.geoNear(long, lat, options);
};

/**
 * connects to the database
 * @returns {Promise|*}
 */
fns.connect = () => {
    console.log('open database', mongoUrl);
    return mongo.connect(mongoUrl)
        .then(db => {
            console.log('database successfully connected');
            database = db;
        })
        .catch(err => {
            console.error('unable to connect to database', err);
        });
};

module.exports = fns;