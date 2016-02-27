'use strict';

const mongo = require('mongodb').MongoClient;

const util = require('./util');
const log = require('ms-utilities').logger;

const mongoUrl = 'mongodb://' + process.env['DB_HOST'] + ':' + process.env['DB_PORT'] + '/' + process.env['DB_NAME'];

const fns = {};
var database = {};

fns.findDataNearby = (collectionId, long, lat, options) => {

    options.spherical = true;
    options.distanceMultiplier = 6371;

    let collection = database.collection(collectionId);
    return collection.geoNear(long, lat, options);
};

fns.genericById = (id, collectionId) => {
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
};

fns.genericById2 = (id, collectionId) => {
    return util.safeObjectId(id)
        .then(oId => {
            return database.collection(collectionId)
                .find({_id: oId})
                .limit(-1)
                .next();
        });
};

fns.getLocationsOfUser = (userId, collectionId) => {

    return database.collection(collectionId)
        .find({user_id: userId})
        .toArray();
};

fns.getLocationsByName = (locationName, collectionId) => {

    return database.collection(collectionId)
        .find({title: locationName})
        .toArray();
};

fns.getImpressionsByLocationId = (locationId/*, query*/) => {
    // TODO include query for pagination
    return database.collection('impressions')
        .find({location_id: locationId})
        .sort({'create_date': 1})
        .toArray();
};

fns.findLocByTitle = (message)=> {
    let collection = database.collection('locations');
    return collection.find({title: message});
};

fns.addSchoenhier = (message) => {

    let collection = database.collection('schoenhiers');
    return collection.insertOne(message);
};

fns.addNewLocation = (message) => {
    let collection = database.collection('locations');
    return collection.insertOne(message);
};

fns.deleteLocation = (locationId) => {
    let collection = database.collection('locations');
    return util.safeObjectId(locationId)
        .then(oId => {
            return collection.deleteOne({'_id': oId});
        });

};

fns.hasUserLocationFavored = (locationId, userId) => {
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
};

fns.updateFavor = (locationId, userId, remove) => {
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
};

fns.genericInsertOne = (obj, collectionId) => {
    let insert = util.decorateNewDateData(obj);
    return database.collection(collectionId).insertOne(insert);
};

fns.getFavoriteLocationsByUserId = (userId) => {
    return database.collection('locations')
        .find({
            'favorites': userId
        })
        .toArray();
};

fns.getCountForLocationsByUserId = (userId) => {
    return database.collection('locations')
        .count({
            'user_id': userId
        });
};

let setupDb = (db) => {
    console.log('setting up database');
    let schoenhier = db.collection('schoenhiers').createIndex({'geotag.coordinates': '2dsphere'});
    let location = db.collection('locations').createIndex({'geotag.coordinates': '2dsphere'});

    return Promise.all([schoenhier, location]);
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
            return setupDb(db);
        })
        .then(() => {
            console.log('db setup successful');
        })
        .catch(err => {
            console.error('unable to connect to database', err);
        });
};


module.exports = fns;
