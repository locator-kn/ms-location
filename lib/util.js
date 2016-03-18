'use strict';

const Hoek = require('hoek');

const ObjectID = require('mongodb').ObjectID;

const util = require('ms-utilities');
const log = util.logger;

const fns = {};

fns.validationError = (err, service, next) => {
    log.error(err, 'Validation failed of' + service);
    next(err);
};

fns.serviceError = (err, service, next) => {
    log.error(err, service + ' failed');
    next(err);
};

fns.decorateNewDateData = (target) => {
    let isoDate = new Date().toISOString();
    return Hoek.merge(target, {
        create_date: isoDate,
        modified_date: isoDate
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