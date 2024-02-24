import { pick as _pick } from 'lodash';
import { getLogger } from './logger';

const log = getLogger('DomUtils');
const logKeyCode = getLogger('KeyCodeMap');

const isAlpha = new RegExp(/[a-z]{1}/)
const KeyCodeMap = new Map();

Object.assign(window._dev || {}, {
    keycodemap: () => console.log(KeyCodeMap)
});

window.navigator.keyboard.getLayoutMap().then(userKeyMap => {
    let keyboardCodes = userKeyMap.keys();
    let keyCode = keyboardCodes.next()
    while (!keyCode.done) {
        let keyValue = userKeyMap.get(keyCode.value);

        if (isAlpha.test(keyValue)) {
            KeyCodeMap.set(keyCode.value, keyValue.toUpperCase());
        } else {
            KeyCodeMap.set(keyCode.value, keyValue);
        }

        keyCode = keyboardCodes.next();
    }
});


export class ShowHideElement {
    constructor(e, display_type = 'block') {
        this.e = e;
        this.display_type = display_type;
        this.e.forEach(e => e.style.display = 'none');
    }

    show = () => this.e.forEach(e => e.style.display = this.display_type);
}


export const getKeyDirection = (e) => {
    return {
        UP: e.key === 'ArrowUp',
        DOWN: e.key === 'ArrowDown',
        LEFT: e.key === 'ArrowLeft',
        RIGHT: e.key === 'ArrowRight'
    }
}

/**
 * Tests of key pressed is a number key (DigitX, NumpadX).
 * These are consistent across keyboard layouts
 * @type {RegExp}
 */
const isNumberKeyCode = new RegExp(/^(Digit|Numpad)[\d]{1}$/);


const keyStringOpts = {
    hotkeys: {
        modifiers: ['meta', 'ctrl', 'alt', 'shift'],
        joiner: '+'
    },
    cheatsheet: {
        modifiers: ['Meta', 'Control', 'Alt', 'Shift'],
        joiner: ' '
    }
}

export const getKeyString = (e, mode='cheatsheet') => {
    log.debug('KeyEvent in:', _pick(e, ['altKey', 'shiftKey', 'ctrlKey', 'metaKey', 'code', 'keyCode', 'key']));

    let opts = keyStringOpts[mode];

    let pressedKeys = [];

    if (e.metaKey) {
        pressedKeys.push(opts.modifiers[0]);
    }

    if (e.ctrlKey) {
        pressedKeys.push(opts.modifiers[1]);
    }

    if(e.altKey){
        pressedKeys.push(opts.modifiers[2]);
    }

    if (e.shiftKey) {
        pressedKeys.push(opts.modifiers[3]);
    }

    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        logKeyCode.debug(`Looking up key ${e.key} ${e.code}`)
        if (isSpaceKey(e)) {
            pressedKeys.push('Space')
        } else if (isNumberKeyCode.test(e.code)) {
            pressedKeys.push(e.code.substr(-1));
        } else if (KeyCodeMap.has(e.code)) {
            logKeyCode.debug(`Using KeyCodeMap value "${e.code}" => "${KeyCodeMap.get(e.code)}"`);
            pressedKeys.push(KeyCodeMap.get(e.code));
        } else {
            pressedKeys.push(e.code);
        }
    }

    log.debug('key out:', pressedKeys);

    // return pressedKeys.join(opts.joiner);
    return pressedKeys;
}

export const captureActions = {
    CAPTURE: 'CAPTURE',
    IGNORE: 'IGNORE',
    EXIT: 'EXIT',
    SAVE: 'SAVE'
}

export const getCaptureAction = (e) => {
    if (isKeyDown(e) && isTabKey(e) && isSingleKeyPress(e)) {
        return captureActions.EXIT;
    }

    if (isKeyDown(e) && isEscKey(e) && isSingleKeyPress(e)) {
        return captureActions.EXIT;
    }

    if (isKeyUp(e) && isTabKey(e) && isSingleKeyPress(e)) {
        return captureActions.IGNORE;
    }

    if (isKeyDown(e)) {
        return captureActions.CAPTURE;
    }

    if (isKeyUp(e)) {
        return captureActions.SAVE;
    }

    return captureActions.IGNORE;
}


export const isTabKey = (e) => {
    return (e.keyCode === 9 || e.key === 'Tab');
}

const isEscKey = (e) => {
    return (e.keyCode === 27 || e.key === 'Escape');
}

export const isEnterKey = (e) => {
    return (e.keyCode === 13 || e.key === 'Enter');
}

export const isSpaceKey = (e) => {
    return (e.key === ' ');
}

const isKeyDown = (e) => {
    return e.type === 'keydown';
}

const isKeyUp = (e) => {
    return e.type === 'keyup';
}

const isSingleKeyPress = (e) => {
    return [ 'metaKey', 'ctrlKey', 'altKey', 'shiftKey' ]
        .map(key => e && e[key] && e[key] === true)
        .filter(i => i)
        .length === 0;
}

