'use strict';
require('dotenv').config({path: '../.env'});
const seneca = require('seneca')();
const datebase = require('./lib/database');

const nearby = require('./lib/nearby');



// select desired transport method
const transportMethod = process.env['SENECA_TRANSPORT_METHOD'] || 'rabbitmq';
const patternPin = 'role:location';

// init database
datebase.connect().then(() => {

    // init seneca and expose functions
    seneca
        .use(transportMethod + '-transport')
        .add(patternPin + ',cmd:nearby', nearby.getLocationsNearby)
        .listen({type: transportMethod, pin: patternPin});
});
