const { contextBridge, ipcRenderer } = require('electron');
const config = require('../../package.json');


const data = require('./data');

contextBridge.exposeInMainWorld('cheatsheetAPI', {
  appName: config.productName,
  saveImage: (imageData) => ipcRenderer.invoke('app:saveImage', imageData),
  handleStateChange: (callback) => ipcRenderer.on('app:stateChange', callback),
  getInitialData: () => ipcRenderer.invoke('app:getLatestSnapshot'),
  onSnapshot: (data) =>  ipcRenderer.invoke('app:saveSnapshot', data)
})