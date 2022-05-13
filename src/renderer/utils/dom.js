import { pick as _pick } from 'lodash';
import { get_for_key, macos_symbols } from './macos_symbols.js';
import { getLogger } from './logger';

const log = getLogger('DomUtils');
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

const letter_key = new RegExp(/^Key[\w]{1}$/);


const keyStringOpts = {
    hotkeys: {
        modifiers: ['meta', 'ctrl','alt', 'shift'],
        joiner: '+'
    },
    cheatsheet: {
        modifiers: ['Meta', 'Control', 'Alt', 'Shift'],
        joiner: '-'
    }
}


export const getKeyString = (e, mode='cheatsheet') => {
    log.debug('KeyEvent in:', _pick(e, ['altKey', 'shiftKey', 'ctrlKey', 'metaKey', 'code', 'keyCode', 'key']));

    let opts = keyStringOpts[mode];

    let kbString = [];

    if (e.metaKey) {
        kbString.push(opts.modifiers[0]);
    }

    if (e.ctrlKey) {
        kbString.push(opts.modifiers[1]);
    }

    if(e.altKey){
        kbString.push(opts.modifiers[2]);
    }

    if (e.shiftKey) {
        kbString.push(opts.modifiers[3]);
    }

    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        if (macos_symbols[e.key.toLowerCase()]) {
            kbString.push(e.key.toLowerCase());
        } else if (letter_key.test(e.code)) {
            kbString.push(e.code.substr(-1));
        } else if (get_for_key(e.key)) {
            kbString.push(get_for_key(e.key));
        } else {
            kbString.push(e.key);
        }
    }

    log.debug('key out:', kbString);

    return kbString.join(opts.joiner);
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

