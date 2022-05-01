/*
  Logging utils
 */

import Logger from "js-logger";

const stage = window.cheatsheetAPI.stage;

console.log(stage)

const { OFF, DEBUG, INFO, WARN, ERROR } = Logger;

Logger.useDefaults({
    defaultLevel: INFO,
    formatter: function (messages, context) {
        if (typeof messages[0] === 'string') {
            let msg = messages.splice(0, 1);
            messages.unshift('\'' + msg +  '\'')
        }
        messages.unshift('[' + context.name + ']');
      },
});

if (stage === 'DEV') {
    Logger.get('AppStore').setLevel(INFO);
    Logger.get('JSX/CursorNavigableForm').setLevel(INFO);
    Logger.get('JSX/CaptureBox').setLevel(INFO);
    Logger.get('JSX/EditItemModal').setLevel(INFO);
    Logger.get('KeyActions').setLevel(INFO);
    Logger.get('KeyConfig').setLevel(INFO);
    Logger.get('KeyEmitter').setLevel(INFO);
    Logger.get('Store').setLevel(INFO);
    Logger.get('Store/action').setLevel(DEBUG);
    Logger.get('Store/patch').setLevel(INFO);
    Logger.get('Store/snapshot').setLevel(INFO);
}




// const defaultDebugLog =
export function getDebugLogger(ns) {
    let log = Logger.get(ns);
    return log.debug.bind(log);
}