'use strict';

const Hoek = require('hoek');

const ObjectID = require('mongodb').ObjectID;

const fns = {};


fns.decorateNewDateData = (target) => {
    return Hoek.merge(target, {
        create_date: new Date().toISOString(),
        modified_date: new Date().toISOString()
    });
};

fns.updateModifiedDate = (target) => {
    return Hoek.merge(target, {
        $currentDate: {
            modified_date: true
        }
    });
};

fns.safeObjectId = (objectIdString, idType) => {

    idType = idType || 'id';

    return new Promise((resolve) => {
        resolve(new ObjectID(objectIdString));

    }).catch(() => {
        throw new Error('Invalid ' + idType);
    });
};

module.exports = fns;