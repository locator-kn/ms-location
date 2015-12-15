'use strict';

const Hoek = require('hoek');

const fns = {};


fns.decorateNewDateData = (target) => {
    return Hoek.merge(target, {
        create_date: new Date().toISOString(),
        modified_date: new Date().toISOString()
    });
};

fns.updateModifiedDate = (target) => {
    return Hoek.merge(target, {
        modified_date: new Date().toISOString()
    });
};

module.exports = fns;