'use strict';

const db = require('./database');
const Joi = require('joi');
const util = require('./util');

const fns = {};

const validation = {};

validation.schoenhier = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
    userid: Joi.string().optional()
});

fns.addSchoenhier = (requestData, done) => {
    Joi.validate(requestData.data, validation.schoenhier, (err, data) => {

        if (err) {
            return done(err);
        }
        let schoenhierData = requestData.data;

        util.decorateNewDateData(schoenhierData);
        console.log(schoenhierData)

        db.addSchoenhier(schoenhierData)
            .then(data => {
                done(null, schoenhierData);
            })
            .catch(done);
    });


};

module.exports = fns;