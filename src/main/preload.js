const { contextBridge, ipcRenderer } = require('electron');

const data = require('./data');

contextBridge.exposeInMainWorld('keymap_api',{
  getInitialData: () => Promise.resolve(data),
  saveImage: (imageData) => ipcRenderer.invoke('app:dialog:saveImage', imageData),
  handleStateChange: (callback) => ipcRenderer.on('app:stateChange', callback)
})