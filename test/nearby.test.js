'use strict';
import test from 'ava';
const proxyquire =  require('proxyquire');

const databaseStub = require('./stubs/database.stub');
const nearby = proxyquire('../lib/nearby', { './database': databaseStub });

test('getLocationsNearby - totally wrong input data', t => {
    nearby.getLocationsNearby({data: {crap: 'crappapa', bla: 'random'}}, (err, data) => {
        if(err) {
            return t.pass();
        }
        t.fail();
    });
});

test('getLocationsNearby - right keys wrong datatypes', t => {
    nearby.getLocationsNearby({data: {lat: 'crappapa', long: 'random', options: {}}}, (err, data) => {
        if(err) {
            return t.pass();
        }
        t.fail();
    });
});

test('getLocationsNearby - correct datatypes', t => {
    nearby.getLocationsNearby({data: {lat: 123, long: 3}}, (err, data) => {
        if(err) {
            return t.fail();
        }
        t.pass();
    });
});

test('getLocationsNearby - corrupt maxLength', t => {
    nearby.getLocationsNearby({data: {lat: 123, long: 3, maxLength: 'not a number'}}, (err, data) => {
        if(err) {
            return t.pass();
        }
        t.fail();
    });
});

test('getLocationsNearby - corrupt limit', t => {
    nearby.getLocationsNearby({data: {lat: 123, long: 3, limit: 'not a number'}}, (err, data) => {
        if(err) {
            return t.pass();
        }
        t.fail();
    });
});
