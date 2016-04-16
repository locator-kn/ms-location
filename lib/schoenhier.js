'use strict';

const db = require('./database');
const Joi = require('joi');
const moment = require('moment');
const util = require('./util');
const validation = require('./validation');

const fns = {};


fns.addSchoenhier = (requestData, done) => {
    Joi.validate(requestData.data, validation.schoenhier, (err, data) => {

        if (err) {
            return done(err);
        }
        let now = moment();
        
        let schoenhierData = {
            geotag: {
                coordinates: [data.long, data.lat],
                type: 'Point'
            },
            create_date: now.toISOString(),
            modified_date: now.toISOString(),
            hour: now.hour()
        };

        db.addSchoenhier(schoenhierData)
            .then(() => done(null, schoenhierData))
            .catch(done);
    });
};


fns.getSchoenhiersNearby = (requestData, done) => {
    Joi.validate(requestData.data, validation.schoenhierNearby, (err, data) => {

        if (err) {
            return done(err);
        }

        let now = moment();
        let twoHoursAgo = now.subtract(2, 'h').hour();
        let twoHoursFromNow = now.add(2, 'h').hour();

        db.findDataNearby('schoenhiers', data.long, data.lat, {
                maxDistance: data.maxDistance / 6371,
                limit: data.limit || 10,
                query: {
                    $and: [
                        {hour: {$gte: twoHoursAgo}},
                        {hour: {$lte: twoHoursFromNow}}
                    ]
                }
            })
            .then(result => {
                done(null, {data: result.results});
            })
            .catch(done);
    });
};

module.exports = fns;