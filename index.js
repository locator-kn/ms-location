
const seneca = require('seneca')();
const module = require('./lib/module');

require('dotenv').config({path: '../.env'});

// select desired transport method
const transportMethod = process.env['SENECA_TRANSPORT_METHOD'] || 'rabbitmq';
const patternPin = 'role:location';

// init seneca and expose functions
seneca
    .use(transportMethod + '-transport')
    .add(patternPin + ',cmd:login', module.doSomething)
    .add(patternPin + ',cmd:else', module.doSomethingElse)
    .listen({type: transportMethod, pin: patternPin});