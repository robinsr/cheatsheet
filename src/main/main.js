const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('./io');
const ActiveWindow = require('./activewindow');
const { stage, conf } = require('./config');
const { createWindow } = require('./window');
const { getLogger, logShutdown } = require('./logger');

const log = getLogger('main');


log.info('Starting main...');
log.debug('Stage:', stage);
log.info('Stage settings:', conf);

const store = new Store(conf);
const userSettings = store.getSettingsSync();

log.info('User settings:', userSettings);


app.whenReady().then(async () => {
    const win = createWindow(conf.window, userSettings);
    const winListener = ActiveWindow(win);

    app.on('quit', () => {
        log.info('App has exited');
        logShutdown();
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    win.once('ready-to-show', () => {
        win.show();

        if (userSettings.alwaysOnTop) {
            // BUG; Must set alwaysOnTop after window is created
            win.setAlwaysOnTop(true, 'floating');
        }
    });

    ipcMain.handle('app:loaded', () => {
        log.info('Handling IPC event: app:loaded')
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
    ipcMain.handle('app:settingsUpdated', (newSettings) => {
        console.info('Syncing user settings', newSettings);

        const settingsKeys = Object.keys(newSettings);

        if (settingsKeys.includes('alwaysOnTop')) {
            // BUG; changing alwaysOnTop after load is buggy
            win.setAlwaysOnTop(newSettings.alwaysOnTop, 'floating');
        }

        if (settingsKeys.includes('activeFollow')) {
            if (newSettings.activeFollow) {
                winListener.startPolling();
            } else {
                winListener.stopPolling();
            }
        }
    });

    ipcMain.handle('app:beep', () => {
        shell.beep();
    });

    ipcMain.handle('app:requestResize', (e) => {
        log.info('Handling IPC event: app:requestResize');
        let { width, height } = conf.window;
        win.setSize(width, height, true);
    });

})