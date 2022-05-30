const config = require('../src/shared/config');

const stage = 'test';
const conf = config;


const mockAPI = {
    apps: {
        save: async (data) => Promise.resolve({}),
        get: async () => Promise.resolve({}),
    },
    settings: {
        save: async (data) => Promise.resolve({}),
        get: async () => Promise.resolve({}),
    },
    image: {
        save: async (img) => Promise.resolve({}),
    },
    subscribe: (eventName, callback) => null,
    emit: (eventName, data) => Promise.resolve(null),
    config: {
        getAll: () => conf,
        get: (key) => conf[ key ]
    },
    stage: () => stage,
    stages: () => [ false, false ],
    systemBeep: () => null
}

module.exports = mockAPI;
