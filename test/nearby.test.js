'use strict';
import test from 'ava';
const proxyquire =  require('proxyquire');

const databaseStub = require('./stubs/database.stub');
const nearby = proxyquire('../lib/nearby', { './database': databaseStub });

test('getLocationsNearby - totally wrong input data', t => {
    nearby.getLocationsNearby({data: {crap: 'crappapa', bla: 'random'}}, (err, data) => {
        t.is(void 0, data);
        t.is('ValidationError', err.name);
    });
});

test('getLocationsNearby - right keys wrong datatypes', t => {
    nearby.getLocationsNearby({data: {lat: 'crappapa', long: 'random', options: {}}}, (err, data) => {
        t.is(void 0, data);
        t.is('ValidationError', err.name);
    });
});

test('getLocationsNearby - correct datatypes', t => {
    nearby.getLocationsNearby({data: {lat: 123, long: 3}}, (err, data) => {

        t.not(void 0, data);
        t.is(null, err);
    });
});

test('getLocationsNearby - corrupt maxLength', t => {
    nearby.getLocationsNearby({data: {lat: 123, long: 3, maxLength: 'not a number'}}, (err, data) => {
        t.is(void 0, data);
        t.is('ValidationError', err.name);
    });
});

test('getLocationsNearby - corrupt limit', t => {
    nearby.getLocationsNearby({data: {lat: 123, long: 3, limit: 'not a number'}}, (err, data) => {
        t.is(void 0, data);
        t.is('ValidationError', err.name);
    });
});
