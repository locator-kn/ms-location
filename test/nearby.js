'use strict';
import test from 'ava';
const proxyquire =  require('proxyquire');

const databaseStub = require('./stubs/database.stub');
const nearby = proxyquire('../lib/nearby', { './database': databaseStub });

test('getLocationsNearby - totally wrong input data', t => {
    nearby.getLocationsNearby({crap: 'crappapa', bla: 'random'}, (err, data) => {
        if(err) {
            return t.pass();
        }
        t.faill();
    });
});


test('getLocationsNearby - right keys wrong datatypes', t => {
    nearby.getLocationsNearby({lat: 'crappapa', long: 'random', options: {}}, (err, data) => {
        if(err) {
            return t.pass();
        }
        t.fail();
    });
});





test('getLocationsNearby - correct datatypes', t => {
    nearby.getLocationsNearby({lat: 123, long: 3, options: {}}, (err, data) => {
        if(err) {
            return t.fail();
        }
        t.pass();
    });
});
