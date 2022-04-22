const { contextBridge, ipcRenderer } = require('electron');

const data = require('./data');

contextBridge.exposeInMainWorld('keymap_api',{
  getInitialData: () => Promise.resolve(data)
})