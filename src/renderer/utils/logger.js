/*
  Logging utils
 */
import Logger from 'js-logger';
import { isObjectLike } from 'lodash';

const stage = window.cheatsheetAPI.stage();

const { OFF, DEBUG, INFO, WARN, ERROR } = Logger;

Logger.useDefaults({
    defaultLevel: INFO,
    formatter: function (messages, context) {
        if (typeof messages[0] === 'string') {
            let msg = messages.splice(0, 1);
            messages.unshift('\'' + msg +  '\'')
        }
        messages.unshift('[' + context.name + ']');

        // Stringify logged objects for file logging
        if (stage === 'prod') {
            for (let i = 0; i < messages.length; i++) {
                if (isObjectLike(messages[i])) {
                    messages[i] = JSON.stringify(messages[i]);
                }
            }
        }
      },
});

if (stage === 'dev') {
    Logger.get('AppStore').setLevel(INFO);
    Logger.get('JSX/CursorNavigableForm').setLevel(INFO);
    Logger.get('JSX/CaptureBox').setLevel(INFO);
    Logger.get('JSX/EditItemModal').setLevel(INFO);
    Logger.get('KeyActions').setLevel(DEBUG);
    Logger.get('KeyConfig').setLevel(DEBUG);
    Logger.get('KeyEmitter').setLevel(INFO);
    Logger.get('Store').setLevel(INFO);
    Logger.get('Store/action').setLevel(INFO);
    Logger.get('Store/patch').setLevel(INFO);
    Logger.get('Store/snapshot').setLevel(INFO);
    Logger.get('SettingsStore/action').setLevel(DEBUG);

    window._dev = {
        offLog: (ns) => Logger.get(ns).setLevel(INFO),
        onLog: (ns) => Logger.get(ns).setLevel(DEBUG),
    }
}

export function getLogger(namespace) {
    return Logger.get(namespace);
}