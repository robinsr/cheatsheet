const { contextBridge, ipcRenderer } = require('electron');
const config = require('../../package.json');


const data = require('./data');

contextBridge.exposeInMainWorld('cheatsheetAPI', {
  thisApp: config.productName,
  saveImage: (imageData) => ipcRenderer.invoke('app:saveImage', imageData),
  handleFocus: (callback) => ipcRenderer.on('app:stateChange:focus', callback),
  handleBlur: (callback) => ipcRenderer.on('app:stateChange:blur', callback),
  handleWindow: (callback) => ipcRenderer.on('app:stateChange:window', callback),
  getInitialData: () => ipcRenderer.invoke('app:getLatestSnapshot'),
  onSnapshot: (data) =>  ipcRenderer.invoke('app:saveSnapshot', data)
})