import hotkeys from 'hotkeys-js';
import { autorun } from 'mobx';
import EventEmitter from 'events';
import { getLogger } from 'utils';
import { key_config } from './key_config.js';

import { rootStore } from 'store';

const log = getLogger('KeyEmitter');
const eventLog = getLogger('KeyEmitter/events', 'DEBUG');

const EVENT_NAMES = {
    KEYS: 'keys',
    SCOPE: 'scope'
};

// Not sure if using event emitter is the best here, but it
// solves the issue of having a new callback every rerender
export default class KeyEmitter extends EventEmitter {
    /** @type {string[]} **/
    installed = [];

    constructor(scopes, defaultScope) {
        super();
        Object.assign(this, { scopes, defaultScope });

        scopes.forEach(s => this.install(s));
        this.setScope(defaultScope, 'KeyEmitter::constructor');

        /** @type Object.<string, function> */
        this.filters = scopes.map(scope => ({
            [scope.config.scope]: scope.eventFilter
        }))
        .reduce((prev, curr) => Object.assign(prev, curr), {});

        hotkeys.filter = (e) => {
            let results = Object.keys(this.filters).map(key => ({
                [key]: this.filters[key].call(null, e, hotkeys.getScope())
            }))
            .reduce((prev, curr) => {
                return Object.assign(prev, curr);
            }, {});

            log.debug('Key scope matches:', results);

            if (Object.values(results).includes(true)) {
                for (const [scope, matches] of Object.entries(results)) {
                    if (matches) {
                        this.setScope(scope, 'KeyEmitter::eventFilters');
                        return true;
                    }
                }
            }

            // should have matched. something has gone wrong
            if (hotkeys.getScope() === 'all') {
                // something has gone wrong
                window.cheatsheetAPI.systemBeep();
            }
        }

        autorun(() => {
            this.setScope(rootStore.state.keyScope, 'KeyEmitter::autorun');
        })
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

        if (!scope || !this.installed.includes(scope)) {
            log.error(`Invalid scope ${scope}`);
            return;
        }

        if (hotkeys.getScope() !== scope) {
            log.debug(`Setting scope: [${scope}], source: [${source}]`);
            hotkeys.setScope(scope);
            this.emit(EVENT_NAMES.SCOPE, scope);
        }
    }

    /**
     * @param {IKeyScopes} scope
     */
    install(scope) {
        let scopeName = scope.config.scope;
        log.debug(`Installing scope: [${scopeName}]`);

        scope.actions.forEach(action => {
            let actionName = [scopeName, action].join(':')

            let { key, run } = key_config[action];
            let { keyup, keydown} = scope.config;

            log.debug(`Installing action: [${actionName}] = "${key}" (${keyup?'key▲':''} ${keydown?'key▼':''})`);

            hotkeys(key, scope.config, (e) => {
                eventLog.debug('Triggering action:', actionName, 'Listener Count:', this.listenerCount(EVENT_NAMES.KEYS));
                this.emit(EVENT_NAMES.KEYS, {
                    event: e, run, actionName
                });
            });
        });

        this.installed.push(scopeName);
    }
}
