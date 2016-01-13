'use strict';
import test from 'ava';
const proxyquire =  require('proxyquire');

const databaseStub = require('./stubs/database.stub');
const newLoc = proxyquire('../lib/newLoc', { './database': databaseStub });

test('addNewLocaton-with empty fields', t => {
    nearby.addNewLocation({data: {crap: 'crappapa', bla: 'random'}}, (err, data) => {
        if(err) {
            return t.pass();
        }
        t.fail();
    });
});