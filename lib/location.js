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
            if(data === undefined){
                return done(new Error('not found'));
            }
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
                        };
                    });
            })
            .then(res => next(null, res))
            .catch(next);

    });
};

fns.addTextImpression = (requestData, next) => {

    let data = requestData.data;
    let impressionObject = {
        user_id: data.user_id,
        location_id: data.location_id,
        data: data.message,
        type: 'text'
    };

    return db.genericById(data.location_id, 'locations')
        .then(result => {
            if (!result) {
                throw Error('Invalid id');
            }
        })
        .then(() => db.genericInsertOne(impressionObject, 'impressions'))
        // TODO add response if res.ops[0] does not exist
        .then(res => res.ops && res.ops.length ? res.ops[0] : {})
        .then(clientResponse => next(null, clientResponse))
        .catch(next);
};


fns.genericAddImpression = (requestData, type, next) => {

    let data = requestData.data;
    let impressionObject = {
        user_id: data.user_id,
        location_id: data.location_id,
        data: '/api/v2/locations/impression/' + type + '/' + data.message._id + '/' + data.message.filename,
        type: type,
        file_id: data.message._id
    };

    return db.genericById(data.location_id, 'locations')
        .then(result => {
            if (!result) {
                throw Error('Invalid id');
            }
        })
        .then(() => db.genericInsertOne(impressionObject, 'impressions'))
        // TODO add response if res.ops[0] does not exist
        .then(res => res.ops && res.ops.length ? res.ops[0] : {})
        .then(clientResponse => next(null, clientResponse))
        .catch(next);
};

fns.addImageImpression = (requestData, next) => {
    fns.genericAddImpression(requestData, 'image', next);
};

fns.addVideoImpression = (requestData, next) => {
    fns.genericAddImpression(requestData, 'video', next);
};

fns.addAudioImpression = (requestData, next) => {
    fns.genericAddImpression(requestData, 'audio', next);
};

fns.getLocationStreamById = (requestData, next) => {
    let data = requestData.data;
    db.getImpressionsByLocationId(data.location_id)
        .then(res => next(null, res))
        .catch(next);
};

fns.getLocationByName = (requestData, done)=> {

    if (!requestData.data || !requestData.data.locationName) {
        return done(new Error('missing location name'));
    }

    db.getLocationsByName(requestData.data.locationName, 'locations')
        .then(data => done(null, data))
        .catch(done);
};

fns.getLocationsOfUser = (requestData, done) => {

    /* if (!requestData.data || !requestData.data.userId) {
     return done(new Error('missing user id'));
     }*/

    db.getLocationsOfUser(requestData.data.userId, 'locations')
        .then(res => done(null, res))
        .catch(done);
};

fns.deleteLocation = (requestData, done) => {

    db.deleteLocation(requestData.data.locationId)
       .then(res => {

            console.log(res.result);
            //todo: rückgabewert überprüfen
            done(null, {});
        })
        .catch(done);
};


fns.getFavoriteLocationbyUserId = (requestData, done) => {

    db.getFavoriteLocationsByUserId(requestData.data.user_id)
        .then(res => done(null, res))
        .catch(done);
};

fns.getCountForLocationsByUserId = (requestData, done) => {
    db.getCountForLocationsByUserId(requestData.data.user_id)
        .then(count => done(null, {count: count}))
        .catch(done);
};


module.exports = fns;
