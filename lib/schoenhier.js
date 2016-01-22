'use strict';

const db = require('./database');
const Joi = require('joi');
const util = require('./util');
const validation = require('./validation');

const fns = {};

const validation = {};

validation.schoenhier = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    userid: Joi.string().optional()
});

validation.schoenhierNearby = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    maxDistance: Joi.number().default(10),
    limit: Joi.number()
});

fns.addSchoenhier = (requestData, done) => {
    Joi.validate(requestData.data, validation.schoenhier, (err, data) => {

        if (err) {
            return done(err);
        }
        let schoenhierData = {
            geotag:{
                coordinates: [data.long, data.lat],
                type: 'Point'
            }
        };

        util.decorateNewDateData(schoenhierData);

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


        db.findDataNearby('schoenhiers', data.long, data.lat, {
                maxDistance: data.maxDistance / 6371,
                limit: data.limit || 10
            })
            .then(result => {
                done(null, result);
            })
            .catch(done);
    });
};

module.exports = fns;