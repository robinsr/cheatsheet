const { app } = require('electron');
const log4js = require('log4js');
const path = require('path');
const { stage } = require('../shared/config.js');
const DEV = stage === 'dev';

const prefix = 'com.robinsr.cheatsheet.main.';
const logPath = app.getPath('logs');

console.log('Using logpath:', logPath);

app.setAppLogsPath(logPath);

if (!DEV) {
    app.commandLine.appendSwitch('enable-logging', 'file');
    app.commandLine.appendSwitch('log-file', path.resolve(logPath, 'cheatsheet.render.log'));
}

const logConfig = {
    dev: {
        appenders: {
            app: {
                type: 'stdout'
            }
        },
        categories: {
            default: {
                appenders: [ 'app' ],
                level: 'debug'
            }
        }
    },
    prod: {
        appenders: {
            app: {
                type: 'file',
                filename: path.resolve(logPath, 'cheatsheet.main.log'),
                maxLogSize: '20M',
                backups: 3}
        },
        categories: {
            default: {
                appenders: [ 'app' ],
                level: 'info'
            }
        }
    }
}

log4js.configure(DEV ? logConfig.dev : logConfig.prod);

const getLogger = (mod) => log4js.getLogger(prefix + mod);

const IPCLogger = getLogger('IPC');
const logIPCEvent = (evt) => IPCLogger.info('Handling IPC Event: ' + evt);

const logShutdown = () => log4js.shutdown();

module.exports = {
    logPath,
    getLogger,
    logIPCEvent,
    logShutdown
}