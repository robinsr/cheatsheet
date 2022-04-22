import { macos_symbols } from 'utils/macos_symbols';
import { pick as _pick } from 'lodash';

export class ShowHideElement {
    constructor(e, display_type = 'block') {
        this.e = e;
        this.display_type = display_type;
    }

    show = () => this.e.forEach(e => e.style.display = this.display_type);
    hide = () => this.e.forEach(e => e.style.display = 'none');
}

const letter_key = new RegExp(/^Key[\w]{1}$/);


export const get_kb_string = (e) => {

    console.debug('keyevent in:', _pick(e, ['altKey', 'shiftKey', 'ctrlKey', 'metaKey', 'code', 'keyCode', 'key']));

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
        } else {
            kbString.push(e.key);
        }
    }

    console.debug('key out:', kbString)

    return kbString.join('-');
}


export const is_tab_key = (e) => {
    return (e.keyCode == 9 || e.key == 'Tab');
}

export const is_single_key = (e) => {
    return [ 'metaKey', 'ctrlKey', 'altKey', 'shiftKey' ]
        .map(key => e && e[key] && e[key] == true)
        .filter(i => i)
        .length == 0;
}

export const oops_handler = (e) => {
    e.preventDefault();
    return event.returnValue = "Are you sure you want to exit?";
}
