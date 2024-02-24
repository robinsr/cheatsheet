
const PREFER_SYMBOL = Symbol('prefer_symbol');
const PREFER_ABBR = Symbol('prefer_abbreviation');
const PREFER_NAME = Symbol('prefer_name');

const macos_symbols = {
    Meta: {
        name: 'command', abbr: 'cmd' , symbol: "⌘", prefs: [ PREFER_SYMBOL ]
    },
    Option: {
        name: 'option', abbr: 'opt' , symbol: "⌥", prefs: [ PREFER_SYMBOL ]
    },
    Alt: {
        name: 'alt', abbr: 'alt' , symbol: "⌥", prefs: [ PREFER_SYMBOL ]
    },
    Control: {
        name: 'control', abbr: 'ctrl' , symbol: "⌃", prefs: [ PREFER_SYMBOL ]
    },
    Shift: {
        name: 'shift', abbr: 'shift' , symbol: "⇧", prefs: [ PREFER_SYMBOL ]
    },
    Space: {
        name: 'space', abbr: 'space', symbol: "␣", prefs: [ PREFER_NAME ]
    },
    Escape: {
        name: 'escape', abbr: 'esc', symbol: "⎋", prefs: [ PREFER_ABBR ]
    },
    ArrowLeft: {
        name: 'left arrow', abbr: 'left' , symbol: "←", prefs: [ PREFER_SYMBOL ]
    },
    ArrowRight: {
        name: 'right arrow', abbr: 'right' , symbol: "→", prefs: [ PREFER_SYMBOL ]
    },
    ArrowUp: {
        name: 'up arrow', abbr: 'up' , symbol: "↑", prefs: [ PREFER_SYMBOL ]
    },
    ArrowDown: {
        name: 'down arrow', abbr: 'down' , symbol: "↓", prefs: [ PREFER_SYMBOL ]
    },
    Tab: {
        name: 'tab', abbr: 'tab', symbol: "⇥", prefs: [ PREFER_SYMBOL ]
    },
    Enter: {
        name: 'return', abbr: 'return' , symbol: "↩", prefs: [ PREFER_SYMBOL ]
    },
    Delete: {
        name: 'delete', abbr: 'del' , symbol: "⌫", prefs: [ PREFER_ABBR ]
    },
    PageUp: {
        name: 'page up', abbr: 'page ↑' , symbol: "⇞", prefs: [ PREFER_NAME ]
    },
    PageDown: {
        name: 'page down', abbr: 'page ↓' , symbol: "⇟", prefs: [ PREFER_NAME ]
    },
    Home: {
        name: 'home', abbr: 'home' , symbol: "↖", prefs: [ PREFER_NAME ]
    },
    End: {
        name: 'end', abbr: 'end', symbol: "↘", prefs: [ PREFER_NAME ]
    },
    CapsLock: {
        name: 'caps lock', abbr: 'lock' , symbol: "⇪", prefs: [ PREFER_NAME ]
    },
    NumLock: {
        name: 'clear', abbr: 'clr', symbol: "⌧", prefs: [ PREFER_NAME ]
    },
    NumpadEnter: {
        name: 'numpad enter', abbr: 'enter' , symbol: "↩", prefs: [ PREFER_ABBR ]
    },
    NumpadEquals: {
        name: 'numpad equals', abbr: 'num=', symbol: '=', prefs: [ PREFER_SYMBOL ]
    },
    NumpadDivide: {
        name: 'numpad divide', abbr: 'num/', symbol: '/', prefs: [ PREFER_SYMBOL ]
    },
    NumpadMultiply: {
        name: 'numpad multiply', abbr: 'num*', symbol: '*', prefs: [ PREFER_SYMBOL ]
    },
    NumpadSubtract: {
        name: 'numpad subtract', abbr: 'num-', symbol: '-', prefs: [ PREFER_SYMBOL ]
    },
    NumpadAdd: {
        name: 'numpad add', abbr: 'num+', symbol: '+', prefs: [ PREFER_SYMBOL ]
    },
    NumpadDecimal: {
        name: 'numpad decimal', abbr: 'num.', symbol: '.', prefs: [ PREFER_SYMBOL ]
    }
}

const SymbolsProxy = new Proxy(macos_symbols, {
    has(symbols, prop) {
        return prop in symbols || Object.keys(symbols).map(k => symbols[k].name).includes(prop);
    },
    get(symbols, prop) {
        if (prop in symbols){
            return symbols[prop];
        }

        let match = Object.keys(symbols).find(k => symbols[k].name === prop);

        if (match) {
            return symbols[match];
        }
    }
});


export const formatKey = (key, overrides) => {
    if (SymbolsProxy[key]) {
        let { useSymbols, useNumpad } = overrides;
        let { name, abbr, symbol, prefs } = SymbolsProxy[key];

        if (useSymbols && prefs.includes(PREFER_SYMBOL)) {
            return symbol;
        }

        if (prefs.includes(PREFER_ABBR)) {
            return abbr;
        }

        if (prefs.includes(PREFER_NAME)) {
            return name;
        }

    } else {
        return key;
    }
}


