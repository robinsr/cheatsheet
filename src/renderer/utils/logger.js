/*
  Logging utils
 */
import Logger from 'js-logger';
import { isObjectLike } from 'lodash';

const [ isDev, isProd ] = window.cheatsheetAPI.stages();

const { OFF, DEBUG, INFO, WARN, ERROR } = Logger;

const log = Logger.get('AppLogger');
log.setLevel(INFO);


Logger.useDefaults({
    defaultLevel: INFO,
    formatter: function (messages, context) {
        if (typeof messages[0] === 'string') {
            let msg = messages.splice(0, 1);
            messages.unshift('\'' + msg +  '\'')
        }
        messages.unshift('[' + context.name + ']');

        // Stringify logged objects for file logging
        if (isProd) {
            for (let i = 0; i < messages.length; i++) {
                if (isObjectLike(messages[i])) {
                    messages[i] = JSON.stringify(messages[i]);
                }
            }
        }
      },
});

if (isDev) {

    window._dev = {
        offLog: (ns) => Logger.get(ns).setLevel(INFO),
        onLog: (ns) => Logger.get(ns).setLevel(DEBUG),
    }
}

/**
 * Change the log level for a specified namespace
 * @param {string} namespace
 * @param {("OFF"|"DEBUG"|"INFO"|"WARN"|"ERROR")} level - dev override log level
 */
export function getLogger(namespace, level='INFO') {
    Logger.get(namespace).setLevel(isDev ? levelsMap[level] : INFO);
    return Logger.get(namespace);
}

const levelsMap = {
    'OFF': OFF,
    'DEBUG': DEBUG,
    'INFO': INFO,
    'WARN': WARN,
    'ERROR': ERROR
}
