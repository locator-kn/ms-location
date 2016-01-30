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
    categories: Joi.array().items(Joi.string()).max(3).default(''),
    userId: Joi.string().required()
});

fns.addNewLocation = (requestData, done)=> {

   /* Joi.validate(requestData.data, validation.newLocation, (err, data) => { //TODO
        if (err) {
            return done(err);
        }*/
        console.log(requestData.data.userId);
        let newLocData = {
            user_id: requestData.data.user_id,
            title: requestData.data.title,
            categories: [requestData.data.categories],
            favorites: [requestData.data.favorites],
            description: requestData.data.description,
            images: requestData.data.images,
            city: requestData.data.city,
            public: requestData.data.public,
            geotag: requestData.data.geotag

        };
        util.decorateNewDateData(newLocData);

        db.addNewLocation(newLocData)
            .then(() => done(null,  newLocData))
            .catch(done);
   // });
};
module.exports = fns;