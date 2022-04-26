const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

console.log(process.env)

const { saveFile } = require('./src/main/io');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 2000,
        height: 1600,
        title: 'Cheat',
        titleBarStyle: 'hiddenInset',
        // titleBarOverlay: {
        //   color: '#2f3241',
        //   symbolColor: '#74b1be'
        // },
        vibrancy: 'content',
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, 'src/main/preload.js')
        }
    });

    win.loadFile('dist/index.html')

    win.webContents.openDevTools();

    return win;
}



app.whenReady().then(() => {
    const win = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    
    const electron_conf = {
        cwd: __dirname,
        logs: app.getPath('logs'),
        appData: app.getPath('appData'),
        userData: app.getPath('userData')
    }

    ipcMain.handle('app:dialog:saveFile', saveFile);
})