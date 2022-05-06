const { contextBridge, ipcRenderer } = require('electron');
const settings = require('electron-app-settings');

let IS_DEV = process.argv.includes('IS_DEV');

contextBridge.exposeInMainWorld('cheatsheetAPI', {
  saveImage: (imageData) => ipcRenderer.invoke('app:saveImage', imageData),
  handleWindow: (callback) => ipcRenderer.on('app:stateChange:window', callback),
  getInitialData: () => ipcRenderer.invoke('app:getLatestSnapshot'),
  onSnapshot: (data) =>  ipcRenderer.invoke('app:saveSnapshot', data),
  stage: IS_DEV ? 'DEV' : 'PROD',
  config: async () => await settings.get('app'),
  configVal: (key) => settings.get(key)
})