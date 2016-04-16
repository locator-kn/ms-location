'use strict';

const mongo = require('mongodb').MongoClient;

const util = require('./util');
const log = require('ms-utilities').logger;

const mongoUrl = 'mongodb://' + process.env['DB_HOST'] + ':' + process.env['DB_PORT'] + '/' + process.env['DB_NAME'];
let database = {};

module.exports = {
    findDataNearby,
    genericById,
    genericById2,
    getLocationsOfUser,
    getLocationsByName,
    getImpressionsByLocationId,
    findLocByTitle,
    addSchoenhier,
    addNewLocation,
    deleteLocation,
    hasUserLocationFavored,
    updateFavor,
    genericInsertOne,
    getFavoriteLocationsByUserId,
    getCountForLocationsByUserId,
    setupDb,
    connect
};

function findDataNearby(collectionId, long, lat, options) {

    options.spherical = true;
    options.distanceMultiplier = 6371;

    let collection = database.collection(collectionId);
    return collection.geoNear(long, lat, options);
}

function genericById(id, collectionId) {
    return util.safeObjectId(id)
        .then(oId => {
            return database.collection(collectionId)
                .find({_id: oId})
                .limit(-1)
                .next()
                .then(res => {
                    if (!res) {
                        log.error('No document found for', {collection: collectionId, id: id});
                        throw Error('not found');
                    }
                    return res;
                });
        });
}

function genericById2(id, collectionId) {
    return util.safeObjectId(id)
        .then(oId => {
            return database.collection(collectionId)
                .find({_id: oId})
                .limit(-1)
                .next();
        });
}

function getLocationsOfUser(userId, collectionId) {

    return database.collection(collectionId)
        .find({user_id: userId})
        .sort({create_date: -1})
        .toArray();
}

function getLocationsByName(locationName, collectionId) {
    let pattern = new RegExp(locationName);

    return database.collection(collectionId)
        .find({title: {$regex: pattern, $options: 'i'}})
        .toArray();
}

function getImpressionsByLocationId(locationId/*, query*/) {
    // TODO include query for pagination
    return database.collection('impressions')
        .find({location_id: locationId})
        .sort({'create_date': -1})
        .toArray();
}

function findLocByTitle(message) {
    let collection = database.collection('locations');
    return collection.find({title: message});
}

function addSchoenhier(message) {

    let collection = database.collection('schoenhiers');
    return collection.insertOne(message);
}

function addNewLocation(message) {
    let collection = database.collection('locations');
    return collection.insertOne(message);
}

function deleteLocation(locationId) {
    let collection = database.collection('locations');
    return util.safeObjectId(locationId)
        .then(oId => {
            return collection.deleteOne({'_id': oId});
        });

}

function hasUserLocationFavored(locationId, userId) {
    return util.safeObjectId(locationId)
        .then(oId => {
            return database.collection('locations')
                .find({'_id': oId, 'favorites': userId})
                .limit(-1)
                .toArray()
                .then(res => {
                    return !!res.length;
                });
        });
}

function updateFavor(locationId, userId, remove) {
    let operation = remove ? '$pull' : '$addToSet';
    let updateObject = {};
    updateObject[operation] = {
        favorites: userId
    };

    return util.safeObjectId(locationId, 'location_id')
        .then(oId => {
            return database.collection('locations')
                .findOneAndUpdate({
                    '_id': oId
                }, updateObject);
        });
}

function genericInsertOne(obj, collectionId) {
    let insert = util.decorateNewDateData(obj);
    return database.collection(collectionId).insertOne(insert);
}

function getFavoriteLocationsByUserId(userId) {
    return database.collection('locations')
        .find({
            'favorites': userId
        })
        .toArray();
}

function getCountForLocationsByUserId(userId) {
    return database.collection('locations')
        .count({
            'user_id': userId
        });
}

function setupDb(db) {
    console.log('setting up database');
    let schoenhier = db.collection('schoenhiers').createIndex({'geotag.coordinates': '2dsphere'});
    let location = db.collection('locations').createIndex({'geotag.coordinates': '2dsphere'});

    return Promise.all([schoenhier, location]);
}

/**
 * connects to the database
 * @returns {Promise|*}
 */
function connect() {
    console.log('open database', mongoUrl);
    return mongo.connect(mongoUrl)
        .then(db => {
            console.log('database successfully connected');
            database = db;
            return setupDb(db);
        })
        .then(() => {
            console.log('db setup successful');
        })
        .catch(err => {
            console.error('unable to connect to database', err);
        });
}

