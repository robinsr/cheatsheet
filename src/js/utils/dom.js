import { macos_symbols } from 'utils/macos_symbols';

export class ShowHideElement {
    constructor(e, display_type = 'block') {
        this.e = e;
        this.display_type = display_type;
    }

    show = () => this.e.forEach(e => e.style.display = this.display_type);
    hide = () => this.e.forEach(e => e.style.display = 'none');
}

const keyMap = {
    k32: 'SPACE',
    k65: 'A',
    k66: 'B',
    k67: 'C',
    k68: 'D',
    k69: 'E',
    k70: 'F',
    k71: 'G',
    k72: 'H',
    k73: 'I',
    k74: 'J',
    k75: 'K',
    k76: 'L',
    k77: 'M',
    k78: 'N',
    k79: 'O',
    k80: 'P',
    k81: 'Q',
    k82: 'R',
    k83: 'S',
    k84: 'T',
    k85: 'U',
    k86: 'V',
    k87: 'W',
    k88: 'X',
    k89: 'Y',
    k90: 'Z',
};

export const get_kb_string = (e) => {
    const id = 'k' + e.keyCode;

    console.debug(`keydown:${keyMap[id]}, keycode:${e.keyCode}`);

    let kbString = [];

    if (e.metaKey) {
        kbString.push('cmd');
    }

    if (e.ctrlKey) {
        kbString.push('ctrl');
    }

    if(e.altKey){
        kbString.push('alt');
    }

    if (e.shiftKey) {
        kbString.push('shift');
    }


    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        if (macos_symbols[e.key.toLowerCase()]) {
            kbString.push(e.key.toLowerCase());
        } else {
            kbString.push(e.key);
        }
    }

    console.debug(kbString)

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
