

/*
  Logging utils
 */

export function getDebugLogger(ns) {
    return (msg, ...data) => console.debug(`[${ns}]`, `'${msg}'`, ...data);
}