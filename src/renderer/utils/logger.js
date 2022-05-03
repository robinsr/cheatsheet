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
    Logger.get('JSX/CaptureBox').setLevel(DEBUG);
    Logger.get('JSX/EditItemModal').setLevel(INFO);
    Logger.get('KeyActions').setLevel(DEBUG);
    Logger.get('KeyConfig').setLevel(DEBUG);
    Logger.get('KeyEmitter').setLevel(DEBUG);
    Logger.get('Store').setLevel(INFO);
    Logger.get('Store/action').setLevel(INFO);
    Logger.get('Store/patch').setLevel(INFO);
    Logger.get('Store/snapshot').setLevel(INFO);
}


export function getDebugLogger(namespace) {
    let log = Logger.get(namespace);
    return log.debug.bind(log);
}

export function getLogger(namespace) {
    return Logger.get(namespace);
}