const { app, BrowserWindow  } = require('electron');
const activeWindows = require('electron-active-window');
const path = require('path');
const { stage, conf } = require('../shared/config.js');
const Store = require('./io');

console.log('Using settings:', conf);

const createWindow = () => {
    const windowConfig = {
        title: 'Cheat',
        titleBarStyle: 'hiddenInset',
        vibrancy: 'content',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.resolve(__dirname, './preload.js')
        }
    }

    Object.assign(windowConfig, conf.window);

    const win = new BrowserWindow(windowConfig);

    if (stage === 'dev') {
        win.loadURL('http://localhost:8080/index.html');
    } else {
        win.loadFile('./dist/index.html');
    }

    /**
     * Active window event.
     *
     * @event App#app:stateChange:window
     * @type {object}
     * @property {string} windowName - Active window (eg "Google Chrome")
     */
    function getActiveWindow() {
        activeWindows().getActiveWindow().then(result => {
            win.webContents.send('app:window-change', {
                windowName: result.windowName
            });
        });
    }

    let pollActiveWindow = setInterval(getActiveWindow, 1000);

    win.on('focus', (e) => {
        win.webContents.send('app:focus');
        win.webContents.send('app:window-change', {
            windowName: conf.name
        });
        clearInterval(pollActiveWindow);
    });

    win.on('blur', (e) => {
        win.webContents.send('app:blur');
        getActiveWindow()
        pollActiveWindow = setInterval(getActiveWindow, 1000);
    });

    if (stage === 'dev') {
        win.webContents.openDevTools();
    }

    return win;
}


/**
 * @listens module:app~saveImage
 */
app.whenReady().then(async () => {
    const win = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    new Store(conf);
})