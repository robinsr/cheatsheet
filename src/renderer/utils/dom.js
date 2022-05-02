import { pick as _pick } from 'lodash';
import { get_for_key, macos_symbols } from './macos_symbols.js';
import { getLogger } from './logger';

const log = getLogger('DomUtils');

export class ShowHideElement {
    constructor(e, display_type = 'block') {
        this.e = e;
        this.display_type = display_type;
    }

    show = () => this.e.forEach(e => e.style.display = this.display_type);
    hide = () => this.e.forEach(e => e.style.display = 'none');
}

const letter_key = new RegExp(/^Key[\w]{1}$/);


export const getKeyString = (e) => {
    log.debug('KeyEvent in:', _pick(e, ['altKey', 'shiftKey', 'ctrlKey', 'metaKey', 'code', 'keyCode', 'key']));

    let kbString = [];

    if (e.metaKey) {
        kbString.push('Meta');
    }

    if (e.ctrlKey) {
        kbString.push('Control');
    }

    if(e.altKey){
        kbString.push('Alt');
    }

    if (e.shiftKey) {
        kbString.push('Shift');
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

    return kbString.join('-');
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

export const beforeUnloadHandler = (e) => {
    e.preventDefault();
    return event.returnValue = "Are you sure you want to exit?";
}
