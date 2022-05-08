const { contextBridge, ipcRenderer: ipc } = require('electron');
const { stage, conf } = require('../shared/config.js');


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
    config: {
        getAll: () => conf,
        get: (key) => conf[key]
    },
    stage: () => stage
}

contextBridge.exposeInMainWorld('cheatsheetAPI', cheatsheetAPI);
