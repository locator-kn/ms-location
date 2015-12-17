'use strict';
import test from 'ava';
const proxyquire =  require('proxyquire');

const databaseStub = require('./stubs/database.stub');
const newLoc = proxyquire('../lib/newLoc', { './database': databaseStub });

test('')