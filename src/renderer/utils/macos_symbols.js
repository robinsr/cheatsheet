// https://www.toptal.com/developers/keycode

let macos_symbols = {
    Meta: { 
        symbol: "⌘", alt: "cmd"
    },
    Option: { 
        symbol: "⌥", alt: "alt"
    },
    Alt: { 
        symbol: "⌥", alt: "alt"
    },
    Control: { 
        symbol: "⌃", alt: "ctrl"
    },
    Shift: { 
        symbol: "⇧", alt: "shift"
    },
    CapsLock: { 
        symbol: "⇪", alt: null
    },
    Fn: {
        symbol: "fn", alt: null
    },
    ArrowLeft: { 
        symbol: "←", alt: null
    },
    ArrowRight: { 
        symbol: "→", alt: null
    },
    ArrowUp: { 
        symbol: "↑", alt: null
    },
    ArrowDown: { 
        symbol: "↓", alt: null
    },
    Tab: { 
        symbol: "⇥", alt: null,
    },
    backtab: { 
        symbol: "⇤", alt: null
    },
    return: { 
        symbol: "↩", alt: null
    },
    Enter: { 
        symbol: "↩", alt: null
    },
    Delete: { 
        symbol: "⌫", alt: "del"
    },
    forwarddelete: { 
        symbol: "⌦", alt: null
    },
    PageUp: { 
        symbol: "⇞", alt: null
    },
    PageDown: { 
        symbol: "⇟", alt: null
    },
    Home: { 
        symbol: "↖", alt: null
    },
    End: { 
        symbol: "↘", alt: null
    },
    Clear: { 
        symbol: "⌧", alt: null
    },
    Space: { 
        symbol: "␣", alt: 'space', useAlt: true
    },
    ' ': {
        symbol: null, alt: 'space', useAlt: true
    },
    Escape: { 
        symbol: "⎋", alt: null
    },
    Eject: { 
        symbol: "⏏", alt: null
    }
}

const unshift_symbols = {
    '!': '1',
    '@': '2',
    '#': '3',
    '$': '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    '_': '-',
    '+': '=',
    '{': '[',
    '}': ']',
    '|': '\\',
    ':': ';',
    '"': '\'',
    '<': ',',
    '>': '.',
    '?': '/'
}

const unalt_symbols = {
    '¡': '1',
    '™': '2',
    '£': '3',
    '¢': '4',
    '∞': '5',
    '§': '6',
    '¶': '7',
    '•': '8',
    'ª': '9',
    'º': '0',
    '–': '-',
    '≠': '=',
    '“': '[',
    '‘': ']',
    '«': '\\',
    '…': ';',
    'æ': '\'',
    '≤': ',',
    '≥': '.',
    '÷': '/'
}

export function get_for_key (key) {
    if (unshift_symbols[key]) {
        return unshift_symbols[key];
    }

    if (unalt_symbols[key]) {
        return unalt_symbols[key];
    }

    if (!macos_symbols[key]){
        return key;
    }

    if (macos_symbols[key].useAlt) {
        return macos_symbols[key].alt;
    } else {
        return macos_symbols[key].symbol;
    }
}

export { macos_symbols }
