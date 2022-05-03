import KeyAction from 'utils/key_action';
import { getLogger } from './logger';
const log = getLogger('KeyConfig');

const CANCEL_ACTION = false;

/**
 * Configure key bindings
 *
 * Each key_config is an object of type:
 * - key: string - hotkeys key string
 * - help: string - optional help string for displaying in help window
 * - emit: function - a function that returns a list of {@link KeyAction}
 */
const key_config = {
    CLEAR_CURSOR: {
        key: 'esc',
        help: null,
        emit: () => ([
             KeyAction.from('setCursor', '', [ null ] )
        ])
    },
    SHOW_HELP_MODAL: {
        key: 'shift+/,?',
        help: 'Show this help window',
        emit: () => ([
            KeyAction.from('setCursor', '', [ 'HELP' ] )
        ])
    },
    FOCUS_SEARCH: {
        key: 'S,/',
        help: 'Moves focus to the search bar',
        emit: () => ([
            KeyAction.from('setCursor', '', ['#SEARCH'] )
        ])
    },
    MOVE_CURSOR: {
        key: 'up, down',
        help: 'Move focus up or down',
        emit: (e) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');

            if (direction === 'DOWN') {
                return [ KeyAction.from('cursorDown', '', []) ];
            } else if (direction === 'UP') {
                return [ KeyAction.from('cursorUp', '', []) ];
            }
        }
    },
    MOVE_SELECTION: {
        key: 'shift+up, shift+down',
        help: 'Move selected item up or down',
        emit: (e) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');

            if (direction === 'DOWN') {
                return [
                    KeyAction.from(
                        'swapItems',
                        (root) => root.apps.isItem(root.cursor) ? root.apps.find(root.cursor).category.path : null,
                        (root) => {
                            let item = root.apps.find(root.cursor);
                            return [ item , item.next ];
                        }) ];
            } else if (direction === 'UP') {
                return [ KeyAction.from(
                        'swapItems',
                        (root) => root.apps.isItem(root.cursor) ? root.apps.find(root.cursor).category.path : null,
                        (root) => {
                            let item = root.apps.find(root.cursor);
                            return [ item.prev, item ];
                        }) ];
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
                     KeyAction.from('nextApp', '/apps', []),
                     KeyAction.from('setCursor', '', (root) => [ root.apps.topItem.id ])
                ]
            } else if (direction === 'PREV') {
                return [
                     KeyAction.from('prevApp', '/apps', []),
                     KeyAction.from('setCursor', '', (root) => [ root.apps.topItem.id ])
                ]
            }
        }
    },
    DELETE_ITEM: {
        key: 'delete',
        help: 'Delete currently highlighted item',
        emit: () => {
            let nextItem = null
            return [
                KeyAction.from('removeItem', '/apps', (root) => {
                    if (root.apps.isItem(root.cursor)) {
                        nextItem = root.apps.find(root.cursor).next.id
                        return [ root.cursor ]
                    } else {
                        return CANCEL_ACTION;
                    }
                }),
                KeyAction.from('setCursor', '', () => {
                    return [ nextItem ]
                })
            ];
        }
    },
    SELECT_ITEM: {
        key: 'E, enter',
        help: 'Open focused shortcut in edit pane',
        emit: () => ([
            KeyAction.from('setEditItem', '/edit', (root) => {
                if (root.apps.isItem(root.cursor)) {
                    return [ root.cursor ]
                } else {
                    return CANCEL_ACTION;
                }
            }),
            KeyAction.from('setCursor', '', [ 'edit-form-label' ])
        ])
    },
    NEW_SHORTCUT: {
        key: 'command+N',
        help: 'Create new shortcut',
        emit: () => ([
             KeyAction.from('addItem', '/apps', (root) => ([ root.cursor ]))
        ])
    },
    NEW_CATEGORY: {
        key: 'N',
        help: 'Create a new category in current app',
        emit: () => ([
             KeyAction.from('addItem', '/apps', (root) => ([ root.cursor ]))
        ])
    },
    CLEAR_EDIT_ITEM: {
        key: 'esc',
        help: 'Exit edit shortcut pane',
        emit: (root) => {
            return [
                KeyAction.from('clearEditItem', '/edit', []),
                KeyAction.from('setCursor', '', (root) => [ root.apps.topItem.id ]),
            ];
        }

    },
    SAVE_EDIT_ITEM: {
        key: 'command+S',
        help: 'Save edit item',
        emit: () => ([
             KeyAction.from('saveEditItem', '/edit', [])
        ])
    },
    NEXT_EDIT_FIELD: {
        key: 'up,down',
        help: null,
        emit: (e) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');

            if (direction === 'DOWN') {
                return [ KeyAction.from('setCursor', '', [ 'formNext_' + e.target.dataset?.navname ]) ];
            } else if (direction === 'UP') {
                return [ KeyAction.from('setCursor', '', [ 'formNext_' + e.target.dataset?.navname ]) ];
            }
        }
    },
    EDIT_CURRENT_APP: {
        key: 'A',
        help: 'Show edit pane for current app',
        emit: () => ([
            KeyAction.from('setEditApp', '/apps', (root) => [ root.apps.selectedApp.id ]),
            KeyAction.from('setCursor', '', [ 'edit-app-name' ])
        ])
    }
}

const makeEventFilter = (name, func) => {
    return (e) => {
        if (func(e)) {
            log.debug('Event filter match:', name);
            return true;
        } else {
            return false
        }
    }
};

const key_scopes = {
    APP: {
        config: { scope: 'APP', keydown: true, keyup: false },
        actions: [
            'SHOW_HELP_MODAL', 'FOCUS_SEARCH', 'MOVE_CURSOR', 'MOVE_SELECTION',
            'CHANGE_APP', 'SELECT_ITEM', 'NEW_SHORTCUT', 'NEW_CATEGORY',
            'DELETE_ITEM', 'EDIT_CURRENT_APP'
        ],
        eventFilter: makeEventFilter('APP', (e) => true)
    },
    HELP: {
        config: { scope: 'HELP', keydown: true, keyup: false },
        actions: [
            'CLEAR_CURSOR'
        ],
        eventFilter: makeEventFilter('HELP', (e) => true)
    },
    SEARCH: {
        config: { scope: 'SEARCH', keydown: false, keyup: true },
        actions: [
        ],
        eventFilter: makeEventFilter('SEARCH', (e) => e.target.id === 'app-search-input' ? 'SEARCH': null)
    },
    EDIT_ITEM: {
        config: { scope: 'EDIT_ITEM' },
        actions: [
            'CLEAR_EDIT_ITEM', 'SAVE_EDIT_ITEM', 'NEXT_EDIT_FIELD'
        ],
        eventFilter: makeEventFilter('EDIT_ITEM', (e) => e.target.dataset?.keyscope === 'EDIT_ITEM' ? 'EDIT_ITEM': null)
    },
    CAPTURE: {
        config: { scope: 'CAPTURE', keydown: true, keyup: true },
        actions: [
            'CLEAR_EDIT_ITEM'
        ],
        eventFilter: makeEventFilter('CAPTURE', (e) => e.target.id === 'capture-box' ? 'CAPTURE': null)
    }
}

export { key_config, key_scopes };
