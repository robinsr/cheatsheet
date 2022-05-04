import Logger from 'js-logger';
import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import { memoize } from 'lodash';
import { elementMatcher, getElementMatcher, getKeyString } from './dom';
import { key_scopes, key_config } from './key_config';

const log = Logger.get('KeyEmitter');

const EVENT_NAMES = {
    KEYS: 'keys',
    SCOPE: 'scope'
};

// Not sure if using event emitter is the best here, but it
// solves the issue of having a new callback every rerender
export class KeyEmitter extends EventEmitter {
    constructor(scopes, defaultScope) {
        super();
        Object.assign(this, { scopes, defaultScope });

        scopes.forEach(s => this.install(s));
        this.setScope(defaultScope, 'KeyEmitter::constructor');

        this.filters = () => (e) => {
            scopes.forEach(scope => {
                if (elementMatcher(e, scope.config.scope, scope.selector)) {
                    this.setScope(scope.config.scope, 'KeyEmitter::globalFilter::selector');
                    return true;
                }
            });
        };
    }

    onKey(cb) {
        this.removeAllListeners(EVENT_NAMES.KEYS);
        this.on(EVENT_NAMES.KEYS, cb);
    }

    onScope(cb) {
        this.removeAllListeners(EVENT_NAMES.SCOPE);
        this.on(EVENT_NAMES.SCOPE, cb);
    }

    setScope(scope, source) {
        if (!source) {
            log.warn('DANGER! No source for set scope!');
        }

        log.debug(`Setting scope: [${scope}], source: [${source}]`);

        hotkeys.setScope(scope);
        hotkeys.filter = key_scopes[scope].eventFilter;

        this.emit(EVENT_NAMES.SCOPE, scope);
    }

    install(scope) {
        let scopeName = scope.config.scope;
        log.debug('Installing scope:', scopeName);

        scope.actions.forEach(action => {
            let actionName = [scopeName, action].join(':')

            let { key, run } = key_config[action];

            log.debug('Installing action:', actionName, key, scope.config);

            hotkeys(key, scope.config, (e) => {
                log.debug('Triggering action', actionName);
                this.emit(EVENT_NAMES.KEYS, {
                    event: e, run, actionName
                });
            });
        });
    }
}


/**
 * Setup keys emitter and install scopes as needed
 */
const getAppKeyEmitter = memoize(() => {
    return new KeyEmitter([
        key_scopes.APP,
        key_scopes.HELP,
        key_scopes.SEARCH,
        key_scopes.CAPTURE,
        key_scopes.EDIT_ITEM,
        key_scopes.EDIT_APP
    ], 'APP');
});

export default getAppKeyEmitter();
