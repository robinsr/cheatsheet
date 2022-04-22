const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 1400
  })

  win.loadFile('index.html')

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });

  // app.setAppLogsPath()


  var electron_conf = {
    cwd: __dirname,
    logs: app.getPath('logs'),
    appData: app.getPath('appData'),
    userData: app.getPath('userData')
  }

  console.log('config:', electron_conf);


})