import Logger from "js-logger";

const log = Logger.get('KeyConfig');

const key_config = {
    CLEAR_CURSOR: {
        key: 'esc',
        help: null,
        emit: () => ([
             [ 'setCursor', '', [ null ] ]
        ])
    },
    SHOW_HELP_MODAL: {
        key: 'shift+/,?',
        help: 'Show this help window',
        emit: () => ([
            ['setCursor', '', [ 'HELP' ] ]
        ])
    },
    FOCUS_SEARCH: {
        key: 'S,/',
        help: 'Moves focus to the search bar',
        emit: () => ([
            [ 'setCursor', '', ['SEARCH'] ]
        ])
    },
    MOVE_SELECTION: {
        key: 'up, down',
        help: 'Move focus up and down',
        emit: (e) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');

            if (direction === 'DOWN') {
                return [ ['cursorDown', '', [] ] ];
            } else if (direction === 'UP') {
                return [ ['cursorUp', '', [] ] ];
            }
        }
    },
    CHANGE_APP: {
        key: 'right, left',
        help: 'Change the app in view',
        emit: (e) => {
            let direction = ( e.key === 'ArrowRight' ? 'NEXT' : 'PREV');

            if (direction === 'NEXT') {
                return [
                     ['nextApp', '/apps', [] ],
                     ['setCursor', '', (root) => [ root.apps.topItem.id ] ]
                ]
            } else if (direction === 'PREV') {
                return [
                     ['prevApp', '/apps', [] ],
                     ['setCursor', '', (root) => [ root.apps.topItem.id ] ]
                ]
            }
        }
    },
    EDIT_ITEM: {
        key: 'E, enter',
        help: 'Open focused shortcut in edit pane',
        emit: () => ([
            [ 'setEditItem', '/edit' ],
            [ 'setCursor', '', [ 'edit-form-label' ] ]
        ])
    },
    NEW_SHORTCUT: {
        key: 'command + n',
        help: 'Create new shortcut',
        emit: () => ([
             [ 'addItem', '/apps', (root) => ([ root.cursor ]) ]
        ])
    },
    NEW_CATEGORY: {
        key: 'n',
        help: 'Create a new category in current app',
        emit: () => ([
             [ 'addItem', '/apps', (root) => ([ root.cursor ]) ]
        ])
    },
    CLEAR_EDIT_ITEM: {
        key: 'esc',
        help: 'Exit edit shortcut pane',
        emit: () => ([
             [ 'clearEditItem', '/edit' ]
        ])
    },
    SAVE_EDIT_ITEM: {
        key: 'command+s',
        help: 'Save edit item',
        emit: () => ([
             [ 'saveEditItem', '/edit' ]
        ])
    },
    NEXT_EDIT_FIELD: {
        key: 'up,down',
        help: null,
        emit: (e) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');

            if (direction === 'DOWN') {
                return [ ['setCursor', '', [ 'formNext_' + e.target.dataset?.navname ] ] ];
            } else if (direction === 'UP') {
                return [ ['setCursor', '', [ 'formNext_' + e.target.dataset?.navname ] ] ];
            }
        }
    }
}

const key_scopes = {
    APP: {
        config: { scope: 'APP', keydown: true, keyup: false },
        actions: [
            'SHOW_HELP_MODAL', 'FOCUS_SEARCH', 'MOVE_SELECTION',
            'CHANGE_APP', 'EDIT_ITEM', 'NEW_SHORTCUT', 'NEW_CATEGORY',
            'CLEAR_CURSOR'
        ],
        eventFilter: (e) => null
    },
    SEARCH: {
        config: { scope: 'SEARCH', keydown: false, keyup: true },
        actions: [],
        eventFilter: (e) => e.target.id === 'app-search-input' ? 'SEARCH': null
    },
    EDIT_ITEM: {
        config: { scope: 'EDIT_ITEM' },
        actions: [
            'CLEAR_EDIT_ITEM', 'SAVE_EDIT_ITEM', 'NEXT_EDIT_FIELD'
        ],
        eventFilter: (e) => e.target.dataset?.keyscope === 'EDIT_ITEM' ? 'EDIT_ITEM': null
    },
    CAPTURE: {
        config: { scope: 'CAPTURE', keydown: true, keyup: true },
        actions: [],
        eventFilter: (e) => e.target.id === 'capture-box' ? 'CAPTURE': null
    }
}

export { key_config, key_scopes };
