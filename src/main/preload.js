const { contextBridge, ipcRenderer } = require('electron');

const data = require('./data');

contextBridge.exposeInMainWorld('keymap_api',{
  getInitialData: () => Promise.resolve(data),
  saveFile: (imageModel) => ipcRenderer.invoke('app:dialog:saveFile', imageModel),
  getSaveFilename: (filename) => ipcRenderer.invoke('app:dialog:getSaveFilename', filename)
})