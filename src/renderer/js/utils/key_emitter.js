import Logger from 'js-logger';
import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import { key_config } from "utils/key_config";
import Optional from "optional-js";
import * as assert from "assert";
import * as _ from 'lodash';

const log = Logger.get('KeyEmitter');

// Not sure if using event emitter is the best here, but it
// solves the issue of having a new callback every rerender
class KeyEmitter extends EventEmitter {
    constructor(scopes, default_scope) {
        super();
        this.default_scope = default_scope;
        this.filters = [];

        scopes.forEach(s => this.install(s));
        this.installFilter();
    }

    onKey(cb) {
        this.removeAllListeners('key');
        this.on('key', cb);
    }

    setScope(scope) {
        log.debug('Setting scope', scope);
        this.default_scope = scope;
        hotkeys.setScope(this.default_scope);
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

            this.setScope('APP');
            return true;
        }

        this.setScope('APP');
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
                    this.emit('key', emitter);
                });
            });
        });

        this.filters.push(scope.eventFilter);
    }

    verifyAction(name, config) {
        try {
            assert.ok(_.isString(config.key));
            assert.ok(_.isFunction(config.emit));
            assert.ok(_.isArray(config.emit({ target: {}, tagName: '' })));
        } catch (assertionError) {
            log.error('Action has errors:', config);
            log.error('Assertion error in action ' + name, assertionError);
        }
    }
}

export default KeyEmitter
