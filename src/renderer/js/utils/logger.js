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


Logger.get('KeyActions').setLevel(OFF);
Logger.get('Store').setLevel(DEBUG);
Logger.get('Store/action').setLevel(DEBUG);
Logger.get('Store/patch').setLevel(OFF);
Logger.get('Store/snapshot').setLevel(OFF);
Logger.get('AppStore').setLevel(DEBUG);



// const defaultDebugLog =
export function getDebugLogger(ns) {
    let log = Logger.get(ns);
    return log.debug.bind(log);
}