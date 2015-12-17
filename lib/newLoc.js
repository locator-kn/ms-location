'use strict';

const db = require('./database');
const Joi = require('joi');

const fns = {};

const validation = {};

validation.newLocation = Joi.object({
    name: Joi.string().alphanum().min(3).max(50).required(),
    long: Joi.number().required(),
    lat: Joi.number().required(),
    description: Joi.string().alphanum().max(140).default(""),
    category: Joi.string().aphanum().max(50)//array mit string
});

fns.addNewLocation = (requestData, done)=> {
    console.log("add new location");
    Joi.validate(requestData.data, validation.addNewLocation, (err, data) => {
        if (err) {
            return done(err);
        }
        db.addNewLocation(data.name, data.long, data.lat, data.comment, data.category)
            .then(data => {
                done(null, data);
            })
            .catch(done);
    });


};