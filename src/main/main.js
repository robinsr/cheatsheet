const { app, BrowserWindow, ipcMain } = require('electron');
const activeWindows = require('electron-active-window');
const path = require('path');
const { stage, conf } = require('../shared/config.js');
const Store = require('./io');

console.log('Using settings:', conf);

const store = new Store(conf);

const userSettings = store.getSettingsSync();



const createWindow = () => {
    const windowConfig = {
        title: 'Cheat',
        titleBarStyle: 'hiddenInset',
        vibrancy: 'content',
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.resolve(__dirname, './preload.js'),
            alwaysOnTop: userSettings.alwaysOnTop || false
        }
    }

    Object.assign(windowConfig, conf.window);

    const win = new BrowserWindow(windowConfig);

    if (stage === 'dev') {
        win.loadURL('http://localhost:8080/index.html');
    } else {
        win.loadFile('./dist/index.html');
    }



    if (stage === 'dev' && process.argv.includes('--console')) {
        win.webContents.openDevTools();
    }

    let { width, height } = conf.window;

    ipcMain.handle('app:requestResize', (e) => {
        console.log('Resizing window');
        win.setSize(width, height, true);
    })

    return win;
}

const activeWindowListener = (win) => {
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

    let pollActiveWindow;

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

    return {
        startPolling: () => {
            if (pollActiveWindow === undefined) {
                pollActiveWindow = setInterval(getActiveWindow, 1000);
            }
        },
        stopPolling: () => {
            clearInterval(pollActiveWindow);
        }
    }
}


app.whenReady().then(async () => {
    const win = createWindow();

    const winListener = activeWindowListener(win);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    win.once('ready-to-show', () => {
        win.show();
    });

    ipcMain.handle('app:loaded', () => {
        // start active window listening after app
        // is ready prevents there already being an
        // unknown window at startup
        winListener.startPolling();
    });

    ipcMain.handle('app:reloading', () => {
        winListener.stopPolling();
    });

    // Any user settings that require an electron API call
    // to take effect (should be saved and applied on app restart)
    ipcMain.handle('app:settingsUpdated', (data) => {
        console.info('Syncing user settings', data);

        const settingsKeys = Object.keys(data);

        if (settingsKeys.includes('alwaysOnTop')) {
            win.setAlwaysOnTop(data.alwaysOnTop);
        }

        if (settingsKeys.includes('activeFollow')) {
            if (data.activeFollow) {
                winListener.startPolling();
            } else {
                winListener.stopPolling();
            }
        }
    });

})