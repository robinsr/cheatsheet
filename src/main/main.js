const { app, BrowserWindow, ipcMain, session } = require('electron');
const settings = require('electron-app-settings');
const activeWindows = require('electron-active-window');
const { saveImage, saveSnapshot, getLatestSnapshot } = require('./io.js');
const path = require('path');
const os = require('os');
require('./data');

const config = require('../../package.json');
const conf = {
    cwd: __dirname,
    logs: app.getPath('logs'),
    appData: app.getPath('appData'),
    userData: app.getPath('userData')
}

const IS_DEV = process.env.ELECTRON_DEV === 'true';

if (IS_DEV) {
    settings.set('app', {
        name: config.productName,
        save: false,
        saveDir: path.resolve(conf.userData, 'snapshots'),
        saveKey: 'dev.json',
        debug: true
    });
} else {
    settings.set('app', {
        name: config.productName,
        save: false,
        saveDir: path.resolve(conf.userData, 'snapshots'),
        saveKey: 'latest.json',
        debug: false
    });
}

console.log('Using settings:', settings.get('app'));

const dimensions = {
    dev: {
        width: 2000, height: 1600
    },
    prod: {
        width: 450, height: 980
    }
}

const createWindow = () => {
    const windowConfig = {
        title: 'Cheat',
        titleBarStyle: 'hiddenInset',
        vibrancy: 'content',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: path.resolve(__dirname, './preload.js'),
            additionalArguments: [ ( IS_DEV ? 'IS_DEV' : null ) ]
        }
    }

    Object.assign(windowConfig, dimensions[ IS_DEV ? 'dev' : 'prod' ]);

    const win = new BrowserWindow(windowConfig);

    win.loadFile('./dist/index.html');

    /**
     * Active window event.
     *
     * @event App#app:stateChnage:window
     * @type {object}
     * @property {string} windowName - Active window (eg "Google Chrome")
     */
    function getActiveWindow() {
        activeWindows().getActiveWindow().then(result => {
            win.webContents.send('app:stateChange:window', {
                windowName: result.windowName
            });
        });
    }

    let pollActiveWindow = setInterval(getActiveWindow, 1000);

    win.on('focus', (e) => {
        win.webContents.send('app:stateChange:focus');
        win.webContents.send('app:stateChange:window', {
            windowName: config.productName
        });
        clearInterval(pollActiveWindow);
    });

    win.on('blur', (e) => {
        win.webContents.send('app:stateChange:blur');
        getActiveWindow()
        pollActiveWindow = setInterval(getActiveWindow, 1000);
    });

    if (IS_DEV) {
        win.webContents.openDevTools();
    }

    return win;
}



app.whenReady().then(async () => {
    const win = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
    


    ipcMain.handle('app:saveImage', saveImage);
    ipcMain.handle('app:saveSnapshot', (e, data) => saveSnapshot(data));
    ipcMain.handle('app:getLatestSnapshot', (e) => getLatestSnapshot());
})