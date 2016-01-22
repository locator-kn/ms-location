'use strict';

const db = require('./database');
const Joi = require('joi');
const util = require('./util');
const fns = {};

const validation = {};

validation.newLocation = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    long: Joi.number().required(),
    lat: Joi.number().required(),
    description: Joi.string().max(140).default(' '),
    //categories: Joi.array().items(Joi.string()).max(3).default(""),
    userId: Joi.string().required()
});

fns.addNewLocation = (requestData, done)=> {

    Joi.validate(requestData.data, validation.newLocation, (err, data) => {
        if (err) {
            return done(err);
        }

        let newLocData = {
            title: data.title,
            geotag: {
                coordinates: [data.long, data.lat],
                type: 'Point'
            },
            description: data.description,
            categories: [data.categories],
            user_id: data.userId
        };
        util.decorateNewDateData(newLocData);

        db.addNewLocation(newLocData)
            .then(() => {
                done(null, newLocData);
            })
            .catch(done);
    });
};
module.exports = fns;