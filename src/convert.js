const keycode = require('keycode');

var oldData = {
    "appList": [
        {
            "id": "s35T7Gm2ze8V5YwWBdLxXF",
            "name": "Webstorm",
            "categories": [
                {
                    "id": "7WiJTSW2ZUdCNDrifuQn2H",
                    "name": "Webstorm 2",
                    "items": [
                        {
                            "id": "vGFQckyXqMr4k4PkwQ6W14",
                            "label": "Split and move right",
                            "command": "Meta-K",
                            "secondary": "Meta-tab"
                        }
                    ]
                },
                {
                    "id": "n5qWT5bVfF6oGrLF1yzoCs",
                    "name": "Webstorm do a thing",
                    "items": [
                        {
                            "id": "oLWsm8faJ28vz97dWnRiZG",
                            "label": "test Save",
                            "command": "Shift-1",
                            "secondary": null
                        },
                        {
                            "id": "4936TyQmARNXgfvSF7BBub",
                            "label": "New Shortcut",
                            "command": "Space",
                            "secondary": null
                        }
                    ]
                }
            ],
            "windowName": "WebStorm"
        },
        {
            "id": "7XrP6QeEuC3mKnoR9x91Y8",
            "name": "iTerm",
            "categories": [
                {
                    "id": "39vQxbsVa4MtkdiUummD7p",
                    "name": "iTerm do things",
                    "items": [
                        {
                            "id": "1VhA3TX1gCT7j221rkgJdw",
                            "label": "Do a thing",
                            "command": "Shift-K",
                            "secondary": null
                        }
                    ]
                }
            ],
            "windowName": "iTerm2"
        },
        {
            "id": "vsr3LiS2Gs8mifWmYc3Has",
            "name": "Quiver",
            "categories": [
                {
                    "id": "dxRMru8BqGwPiQBmrRoyXp",
                    "name": "Multi-key shortcuts",
                    "items": [
                        {
                            "id": "ukmDJyDboRgtPRcVAD7rwJ",
                            "label": "New Shortcut",
                            "command": "Meta-K",
                            "secondary": "Meta-B"
                        },
                        {
                            "id": "jhs7rPWMwEqMnfJYRWZmCQ",
                            "label": "New Shortcut",
                            "command": "space",
                            "secondary": null
                        }
                    ]
                },
                {
                    "id": "uz2a6BQJkzu7ZJTbufpDZL",
                    "name": "Format",
                    "items": [
                        {
                            "id": "2XVZGLTjLmaKwV1KKqC7h1",
                            "label": "Increase Heading Level",
                            "command": "Control-Shift-]",
                            "secondary": null
                        },
                        {
                            "id": "iMTSMkK1c4KXytu7UmLDwu",
                            "label": "Decrease Deading Level",
                            "command": "Control-Shift-[",
                            "secondary": null
                        },
                        {
                            "id": "ik4NUKr3gPfbdhiNbZ5a9a",
                            "label": "Add/Edit Link",
                            "command": "Meta-K",
                            "secondary": null
                        },
                        {
                            "id": "4MfKzsa1JP87Wj542iorxK",
                            "label": "Bold",
                            "command": "Meta-B",
                            "secondary": null
                        },
                        {
                            "id": "bD9HPWJ2VbpXCXYB6PvpBZ",
                            "label": "Italic",
                            "command": "Meta-I",
                            "secondary": null
                        },
                        {
                            "id": "dQYqD3HruSE4FVQEPJAYpd",
                            "label": "Underline",
                            "command": "Meta-U",
                            "secondary": null
                        },
                        {
                            "id": "w1THVHiUahn3zxFFQBWDXk",
                            "label": "Strikethrough",
                            "command": "Control-Shift-S",
                            "secondary": null
                        },
                        {
                            "id": "pDNDLTkP1ZNcD3phMYn5xD",
                            "label": "Highlight",
                            "command": "Control-Shift-H",
                            "secondary": null
                        },
                        {
                            "id": "41NoqaN6hkDGPSHmfwKR7A",
                            "label": "Inline Code",
                            "command": "Control-Shift-K",
                            "secondary": "Shift-G"
                        },
                        {
                            "id": "v9s9dRFjcaKkJmwrQaZzSw",
                            "label": "Do something",
                            "command": "Shift-H",
                            "secondary": null
                        }
                    ]
                },
                {
                    "id": "iymARv7tWfpxZDPkYbmBUf",
                    "name": "Note",
                    "items": [
                        {
                            "id": "gggMznAS6fKWLggtmP9joM",
                            "label": "Edit Note Tags",
                            "command": "Meta-'",
                            "secondary": null
                        },
                        {
                            "id": "rDycmJYyEUbUL1pDGCWs36",
                            "label": "Copy Note Link",
                            "command": "Control-Alt-Meta-C",
                            "secondary": null
                        },
                        {
                            "id": "kiy8QHguZk4GUy5yY2Zhnn",
                            "label": "Toggle Editor/Preview",
                            "command": "Meta-Shift-P",
                            "secondary": null
                        },
                        {
                            "id": "rSJEZZkfipEDREztUozeqU",
                            "label": "Delete Note",
                            "command": "Meta-Delete",
                            "secondary": null
                        },
                        {
                            "id": "hWrhBz8NQxu1ZNSXDH5jfb",
                            "label": "New Shortcut",
                            "command": "space",
                            "secondary": null
                        }
                    ]
                },
                {
                    "id": "5ReyL4kKQUxFRsXKTjHHzC",
                    "name": "Cell",
                    "items": [
                        {
                            "id": "pX64G1mTHj9eGTX89DNg95",
                            "label": "New Cell",
                            "command": "Shift-Enter",
                            "secondary": null
                        },
                        {
                            "id": "fhELuriprWkR9dwkWx1e4J",
                            "label": "New Cell Above",
                            "command": "Meta-Shift-Enter",
                            "secondary": null
                        },
                        {
                            "id": "vXyoG4DmkcRb3upLGbPX3Y",
                            "label": "New Cell At Cursor",
                            "command": "Meta-Shift-I",
                            "secondary": null
                        },
                        {
                            "id": "ajaFx9gNa5kPmoP1TWEq6e",
                            "label": "Split Cell",
                            "command": "Alt-Meta-Enter",
                            "secondary": null
                        },
                        {
                            "id": "huRoVA8RU697kAeFhqQatF",
                            "label": "Cut Cell",
                            "command": "Meta-Shift-X",
                            "secondary": null
                        },
                        {
                            "id": "wdb1LVdoioTkuwEKAFBAJV",
                            "label": "Copy Cell",
                            "command": "Meta-Shift-C",
                            "secondary": null
                        },
                        {
                            "id": "1W3dHiiUhhVggVEvP7Stb5",
                            "label": "Paste Cell",
                            "command": "Meta-Shift-V",
                            "secondary": null
                        },
                        {
                            "id": "rHTteeWpBs72Hkfp5kt96m",
                            "label": "Delete Cell",
                            "command": "Meta-Shift-K",
                            "secondary": null
                        },
                        {
                            "id": "cH1AcaT1fRF24vpkyFXWiu",
                            "label": "Convert to Text Cell",
                            "command": "Alt-Meta-1",
                            "secondary": null
                        },
                        {
                            "id": "nEwYQpkiePVgvrwKVBTezj",
                            "label": "Convert to Code Cell",
                            "command": "Alt-Meta-2",
                            "secondary": null
                        },
                        {
                            "id": "5d5BhfJHiRrcK8fXAPoeY3",
                            "label": "Convert to Markdown Cell",
                            "command": "Alt-Meta-3",
                            "secondary": null
                        },
                        {
                            "id": "gzd73MYEL9qeN6LkpNKKxf",
                            "label": "Move Cell Up",
                            "command": "Alt-Meta-up",
                            "secondary": null
                        },
                        {
                            "id": "wgnm5hfVc23oKBkcQt6s8S",
                            "label": "Move Cell Down",
                            "command": "Alt-Meta-down",
                            "secondary": null
                        },
                        {
                            "id": "bgQNoKjsTSQHAsg7X8Xmkm",
                            "label": "New Shortcut",
                            "command": "space",
                            "secondary": null
                        }
                    ]
                }
            ],
            "windowName": "Quiver"
        }
    ]
}


function convert(str) {
    return str.split('-')
        .map(i => i.toLowerCase())
        .map(i => i === 'meta' ? 'command' : i)
        .map(i => {
            let result = keycode(i);
            if (!result) {
                throw new Error(`Dont recognize "${i}" in ${str}`)
            } else {
                return result;
            }
        })
}

let newData = oldData.appList.map(a => {
    a.categories = a.categories.map(c => {

        c.items = c.items.map(i => {
            i.command = convert(i.command);
            if (i.secondary) {
                i.secondary = convert(i.secondary);
            }
            
            return i;
        });

        return c;
    });

    return a;
}, {
    appList: []
})

console.log(JSON.stringify(newData, null, 0));