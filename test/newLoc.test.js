'use strict';
import test from 'ava';
const proxyquire =  require('proxyquire');

const databaseStub = require('./stubs/database.stub');
const newLoc = proxyquire('../lib/newLoc', { './database': databaseStub });

test('addNewLocaton-with crappy data', t => {
    newLoc.addNewLocation({data: {crap: 'crappapa', bla: 'random'}}, (err, data) => {
        t.is(void 0, data);
        t.is('ValidationError', err.name);
    });
});