'use strict';

const path = require('path');
const pwd = path.join(__dirname, '..', '/.env');
require('dotenv').config({path: pwd});

const util = require('ms-utilities');

const seneca = require('seneca')();
const datebase = require('./lib/database');

const nearby = require('./lib/nearby');
const schoenhier = require('./lib/schoenhier');
const location = require('./lib/location');
const newLoc = require('./lib/newLoc');


// select desired transport method
const transportMethod = process.env['SENECA_TRANSPORT_METHOD'] || 'rabbitmq';
const patternPin = 'role:location';

// init database
datebase.connect().then(() => {

    // init seneca and expose functions
    seneca
    //.use(transportMethod + '-transport')

        .client({type: 'tcp', port: 7010, host: 'localhost', pin: 'role:reporter'})

        .add(patternPin + ',cmd:nearby', nearby.getLocationsNearby)
        .add(patternPin + ',cmd:nearby', nearby.getLocationsNearby)
        .add(patternPin + ',cmd:addschoenhier', schoenhier.addSchoenhier)
        .add(patternPin + ',cmd:nearbyschoenhier', schoenhier.getSchoenhiersNearby)
        .add(patternPin + ',cmd:locationById', location.getLocationById)
        .add(patternPin + ',cmd:addnewlocation',newLoc.addNewLocation)
        //.add(patternPin+',cmd:locationbyname',location.getLocationByTitle)
        .add(patternPin+',cmd:getlocbyuserid',location.getLocationsOfUser)
        .add(patternPin + ',cmd:toggleFavor', location.toggleFavorLocation)
        .add(patternPin + ',cmd:addimpression,type:text', location.addTextImpression)
        .add(patternPin + ',cmd:addimpression,type:image', location.addImageImpression)
        .add(patternPin + ',cmd:getlocationstream', location.getLocationStreamById)
        //.act({
        //    role: 'location',
        //    cmd: 'addimpression',
        //    type: 'text',
        //    data: {
        //        location_id: '567800aafb3dcfc1d9f85436',
        //        user_id: '56786fe35227864133663976',
        //        message: 'Hallo, tolle location das da'
        //
        //    }
        //}, (err, data) => {
        //    console.log(err || data);
        //})
        //.listen({type: transportMethod, pin: patternPin});

        .listen({type: 'tcp', port: 7001, pin: patternPin})
        .wrap(patternPin, util.reporter.report);
});
