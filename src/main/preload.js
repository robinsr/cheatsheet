const { contextBridge, ipcRenderer: ipc } = require('electron');
const { stage, conf, isDev, isProd } = require('../shared/config.js');

/**
 * @class cheatsheetAPI
 * @constructor
 * @global
 */
const cheatsheetAPI = {
    apps: {
        save: async (data) => await ipc.invoke('api:apps:save', data),
        get: async () => await ipc.invoke('api:apps:get')
    },
    settings: {
        save: async (data) => await ipc.invoke('api:settings:save', data),
        get: async () => await ipc.invoke('api:settings:get')
    },
    image: {
        save: async (img) => await ipc.invoke('api:image:save', img)
    },
    subscribe: (eventName, callback) => ipc.on(eventName, callback),
    emit: (eventName, data) => ipc.invoke(eventName, data),
    config: {
        getAll: () => conf,
        get: (key) => conf[key]
    },
    stage: () => stage,
    stages: () => [ isDev(), isProd() ],
    systemBeep: () => ipc.invoke('app:beep'),
    reload: () => ipc.invoke('app:reload')
}

contextBridge.exposeInMainWorld('cheatsheetAPI', cheatsheetAPI);
contextBridge.exposeInMainWorld('API', cheatsheetAPI);
