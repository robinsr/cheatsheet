import { getKeyDirection } from './dom';
import { getLogger } from './logger';
const log = getLogger('KeyConfig');

/**
 * Configure key bindings
 *
 * Each key_config is an object of type:
 * - key: string - hotkeys key string
 * - help: string - optional help string for displaying in help window
 * - run: function - a function to invoke when key is pressed
 */
const key_config = {
    CLEAR_CURSOR: {
        key: 'esc',
        help: null,
        run: (e, root) => {
            root.setCursor(null);
        }
    },
    SHOW_HELP_MODAL: {
        key: 'shift+/,?',
        help: 'Show this help window',
        run: (e, root) => {
            root.setCursor('HELP');
        }
    },
    FOCUS_SEARCH: {
        key: 'S,/',
        help: 'Moves focus to the search bar',
        run: (e, root) => {
            root.setCursor('SEARCH');
        }
    },
    MOVE_CURSOR: {
        key: 'up, down',
        help: 'Move focus up or down',
        run: (e, root) => {
            let direction = getKeyDirection(e)

            if (direction.UP) {
                root.cursorUp();
            } else {
                root.cursorDown();
            }
        }
    },
    MOVE_SELECTION: {
        key: 'shift+up, shift+down',
        help: 'Move selected item up or down',
        run: (e, root) => {
            let direction = getKeyDirection(e);

            if (root.apps.isItem(root.cursor)) {
                let item = root.apps.find(root.cursor);

                if (direction.UP) {
                    item.category.swapItems(item.prev, item);
                } else {
                    item.category.swapItems(item, item.next);
                }
            }
        }
    },
    CHANGE_APP: {
        key: 'right, left',
        help: 'Change the app in view',
        run: (e, root) => {
            let direction = ( e.key === 'ArrowRight' ? 'NEXT' : 'PREV');

            if (direction === 'NEXT') {
                root.apps.nextApp()
                root.setCursor(root.apps.topItem.id)
            } else if (direction === 'PREV') {
                root.apps.prevApp();
                root.setCursor(root.apps.topItem.id)
            }
        }
    },
    DELETE_ITEM: {
        key: 'delete',
        help: 'Delete currently highlighted item',
        run: (e, root) => {
            if (root.apps.isItem(root.cursor)) {
                let nextItem = root.apps.find(root.cursor).next?.id || root.apps.topItem.id;
                root.apps.removeItem(root.cursor);
                root.setCursor(nextItem);
            }
        }
    },
    SELECT_ITEM: {
        key: 'E, enter',
        help: 'Open focused shortcut in edit pane',
        run: (e, root) => {
            root.edit.setEditItem(root.cursor);
            root.setCursor('edit-form-label');
        }
    },
    NEW_SHORTCUT: {
        key: 'command+N',
        help: 'Create new shortcut',
        run: (e, root) => {
             root.apps.addItem(root.cursor);
        }
    },
    NEW_CATEGORY: {
        key: 'N',
        help: 'Create a new category in current app',
        run: (e, root) => {
            root.apps.addItem(root.cursor);
        }
    },
    CLEAR_EDIT_ITEM: {
        key: 'esc',
        help: 'Exit edit shortcut pane',
        run: (e, root) => {
            let editItem = root.edit.editItem.id.replace('__edit__', '');
            root.edit.clearEditItem();
            root.setCursor(editItem);
        }
    },
    SAVE_EDIT_ITEM: {
        key: 'enter,command+S',
        help: 'Save edit item',
        run: (e, root) => {
            root.edit.saveEditItem();
        }
    },
    NEXT_EDIT_FIELD: {
        key: 'up,down',
        help: null,
        run: (e, root) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');

            if (direction === 'DOWN') {
                root.setCursor('formNext_' + e.target.dataset?.navname);
            } else if (direction === 'UP') {
                root.setCursor('formNext_' + e.target.dataset?.navname);
            }
        }
    },
    EDIT_CURRENT_APP: {
        key: 'A',
        help: 'Show edit pane for current app',
        run: (e, root) => {
            root.apps.setEditApp(root.apps.selectedApp.id);
            root.setCursor('edit-app-name');
        }
    },
    CLEAR_EDIT_APP: {
        key: 'esc',
        help: null,
        run: (e, root) => {
            root.apps.clearEditApp()
            root.setCursor(root.apps.topItem.id);
        }
    },
    MOVE_SEARCH_CURSOR: {
        key: 'up,down',
        help: null,
        run: (e, root) => {
            let direction = getKeyDirection(e);
            let { cursor, setCursor, search, apps } = root;

            if (cursor?.startsWith('search_')) {
                let itemId = cursor.replace('search_', '');
                if (direction.UP) {
                    setCursor('search_' + search.prev(itemId).id);
                } else {
                    setCursor('search_' + search.next(itemId).id);
                }
            } else if (search.first) {
                setCursor('search_' + search.first.id);
            }
        }
    },
    SELECT_SEARCH_RESULT: {
        key: 'enter',
        help: null,
        run: (e, root) => {
            let { cursor, setCursor, search, apps } = root;
            let itemId = cursor.replace('search_', '');
            let item = apps.find(itemId);

            apps.setActiveApp(item.app.id);
            setCursor(itemId);
            search.clearQuery();
        }
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
        eventFilter: makeEventFilter('APP', (e) => {
            let tagName = e.target.tagName;
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(tagName)) {
                if (e.target.id === 'search-box') {
                    return 'SEARCH';
                }
            }
            return 'APP';
        })
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
            'MOVE_SEARCH_CURSOR', 'SELECT_SEARCH_RESULT'
        ],
        eventFilter: makeEventFilter('SEARCH', (e) => true)
    },
    EDIT_ITEM: {
        config: { scope: 'EDIT_ITEM' },
        actions: [
            'CLEAR_EDIT_ITEM', 'SAVE_EDIT_ITEM', 'NEXT_EDIT_FIELD'
        ],
        eventFilter: makeEventFilter('EDIT_ITEM', (e) => e.target.dataset?.keyscope === 'EDIT_ITEM' ? 'EDIT_ITEM': null)
    },
    EDIT_APP: {
        config: { scope: 'EDIT_APP' },
        actions: [
            'CLEAR_EDIT_APP'
        ],
        eventFilter: makeEventFilter('EDIT_APP', (e) => true)
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
