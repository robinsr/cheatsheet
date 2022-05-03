import * as assert from 'assert';
import { isArray, isFunction, isString } from 'lodash';

/**
 * A KeyAction maps to MST action type
 */
class KeyAction {

    /**
     * Key action constructor
     * @param actionName - Name of MST action
     * @param actionPath - Path of model in MST to apply action
     * @param actionArgs - Array of string arguments for action, or an args supplier
     *                     that takes the MST root as a parameter and returns an array
     *                     of string arguments for the action. Or returns false to
     *                     cancel any subsequent actions
     */
    constructor(actionName, actionPath, actionArgs) {
        validateArgs(actionName, actionPath, actionArgs);
        Object.assign(this, { actionName, actionPath, actionArgs });
    }

    get args() {
        return [ this.actionName, this.actionPath, this.actionArgs ];
    }

    get hasPathSupplier() {
        return isFunction(this.actionPath);
    }

    get hasArgSupplier() {
        return isFunction(this.actionArgs);
    }

    static from = (a, p, r) => {
        return new KeyAction(a, p, r);
    }

    static isAction = (test) => {
        return test instanceof KeyAction;
    }
}

const validateArgs = (a, p, r) => {
    assert.ok(isString(a), `Action name invalid: [${a}]`);
    assert.ok(isString(p) || isFunction(p), `Action ${a} path invalid: [${p}]`);
    assert.ok(isArray(r) || isFunction(r), `Action ${a} has invalid args`);
}

export default KeyAction;
