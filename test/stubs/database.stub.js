'use strict';

const fns = {};

fns.getAllUsers = (message) => {
    if (message.cmd !== 'test') {
        return Promise.reject({message: 'cmd was not test', code: 4000});
    }
    return Promise.resolve({doc: 'asd', processId: process.pid});
};

fns.findLocationsNearby = (long, lat, options) => {
    if (!long || !lat) {
        return Promise.reject({message: 'long and lat must be defined', code: 4000});
    }
    return Promise.resolve([{
        dis: 0.0000018511803197994947,
        obj: {
            _id: 'cb71328e75f25d7d343cb0cbbd9a56db',
            userid: 'ec26fc9e9342d7df21a87ab2477d5cf7',
            preLocation: false,
            create_date: '2015-07-22T10:19:22.293Z',
            images: [Object],
            modified_date: '2015-07-27T07:24:06.381Z',
            tags: [Object],
            title: 'Locator Headquarter',
            description: 'Hier wurden die letzten Vorkehrungen getroffen bevor Locator online ging. Jetzt wird hier weiter an der App entwickelt. :)',
            city: [Object],
            public: true,
            geotag: [Object],
            delete: false
        }
    }]);
};


module.exports = fns;