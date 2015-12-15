'use strict';

const Hoek = require('hoek');

const fns = {};


fns.decorateNewDateData = (target) => {
    return Hoek.merge(target, {
        create_date: Date.now(),
        modified_date: Date.now()
    });
};

fns.updateModifiedDate = (target) => {
    return Hoek.merge(target, {
        modified_date: Date.now()
    });
};

module.exports = fns;