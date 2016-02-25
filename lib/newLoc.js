'use strict';

const db = require('./database');
const Joi = require('joi');
const util = require('./util');
const fns = {};

const validation = {};


validation.newLocation = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(140).default(' '),
    categories: Joi.array().items(Joi.string().valid('nature', 'culture', 'secret', 'gastro', 'party', 'holiday')).min(1).max(3).required(),
    user_id: Joi.string().required(),
    favorites: Joi.array(),
    images: Joi.object().keys({
        xlarge: Joi.string().required(),
        large: Joi.string().required(),
        normal: Joi.string().required(),
        small: Joi.string().required()
    }).required(),

    geotag: Joi.object().keys({
        coordinates: Joi.array().items(Joi.number()).length(2),
        type: Joi.valid('Point')
    }),
    city: Joi.object().keys({
        title: Joi.string(),
        place_id: Joi.string()
    }).required(),
    public: Joi.boolean().required()
});

fns.addNewLocation = (requestData, done)=> {

    Joi.validate(requestData.data, validation.newLocation, (err, requestData) => { //TODO
        if (err) {
            return util.validationError(err, 'new location create service', done);
        }

        let loc = util.decorateNewDateData(requestData);

        db.addNewLocation(loc)
            .then(() => done(null,{data: loc}))
            .catch(done);
    });
};
module.exports = fns;