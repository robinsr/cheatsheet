import Logger from 'js-logger';
import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import { memoize } from 'lodash';
import { key_scopes, key_config } from './key_config';
import Optional from 'optional-js';
import * as assert from 'assert';
import * as _ from 'lodash';

const log = Logger.get('KeyEmitter');

const EVENT_NAMES = {
    KEYS: 'keys',
    SCOPE: 'scope'
};

// Not sure if using event emitter is the best here, but it
// solves the issue of having a new callback every rerender
export class KeyEmitter extends EventEmitter {
    constructor(scopes, default_scope) {
        super();
        this.default_scope = default_scope;
        this.filters = [];

        scopes.forEach(s => this.install(s));
        // this.installFilter();
        this.setScope(default_scope);
    }

    onKey(cb) {
        this.removeAllListeners(EVENT_NAMES.KEYS);
        this.on(EVENT_NAMES.KEYS, cb);
    }

    onScope(cb) {
        this.removeAllListeners(EVENT_NAMES.SCOPE);
        this.on(EVENT_NAMES.SCOPE, cb);
    }

    setScope(scope) {
        log.debug('Setting scope', scope);
        this.default_scope = scope;

        hotkeys.setScope(scope);
        hotkeys.filter = key_scopes[scope].eventFilter;

        this.emit(EVENT_NAMES.SCOPE, scope);
    }

    installFilter() {
        hotkeys.filter = event => {
            let matchingScope = Optional.ofNullable(this.filters
                .map(f => f(event))
                .filter(s => s !== null)
                .at(0));

            if (matchingScope.isPresent()) {
                this.setScope(matchingScope.get());
                return true;
            }

            let tagName = event.target.tagName;
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(tagName)) {
                return false;
            }

            this.setScope(this.default_scope);
            return true;
        }

        this.setScope(this.default_scope);
    }

    install(scope) {
        let scopeName = scope.config.scope;
        log.debug('Installing scope:', scopeName);

        scope.actions.forEach(action => {
            let config = key_config[action];
            let actionName = [scopeName, action].join(':')

            log.debug('Installing action:', actionName, config.key, scope.config);

            this.verifyAction(actionName, config);

            hotkeys(config.key, scope.config, (e) => {
                log.debug('Triggering action', actionName);

                config.emit(e).forEach(emitter => {
                    log.debug('Emitting', actionName, emitter);
                    this.emit(EVENT_NAMES.KEYS, emitter);
                });
            });
        });

        this.filters.push(scope.eventFilter);
    }

    verifyAction(name, config) {
        const dummyEvent = { target: {}, tagName: '' };
        try {
            assert.ok(_.isString(config.key), `Action ${name} config.key is invalid`);
            assert.ok(_.isFunction(config.emit), `Action ${name} config.emit is not a function`);
            assert.ok(_.isArray(config.emit(dummyEvent)), `Action ${name} config.emit returns invalid action config`);
        } catch (assertionError) {
            log.error('Action has errors:', config);
            log.error('Assertion error in action ' + name, assertionError);
        }
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
        key_scopes.EDIT_ITEM
    ], 'APP');
});

export default getAppKeyEmitter();
