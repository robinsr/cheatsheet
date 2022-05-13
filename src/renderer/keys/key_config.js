import { getKeyDirection } from 'utils/dom.js';
import { getLogger } from 'utils/logger.js';
const log = getLogger('KeyConfig');

/**
 * @typedef {object} IKeyAction
 * @property {string} key - hotkeys key string
 * @property {string} helpMessage - a useful help message
 * @property {function(e: KeyboardEvent, root: IRootStore)} run - function to run on key event
 */

/**
 * @type {Object.<string, IKeyAction>}
 */
export const key_config = {
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
        key: '/',
        help: 'Go to search',
        run: (e, root) => {
            root.setCursor('SEARCH');
        }
    },
    MOVE_CURSOR: {
        key: 'up, down',
        help: 'Move highlight up or down',
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
        help: 'Move highlighted item up or down',
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

            let { apps, edit, cursor, setCursor } = root;

            // TODO; search bar does not have its own scope
            if (e.target?.id === 'app-search-input') {
                log.warn('TODO: search bar does not have its own scope')
                return;
            }

            if (apps.isItem(cursor)) {
                edit.setEditItem(cursor);
                setCursor('edit-form-label');
            } else {
                log.warn('Enter key pressed, but cursor value is not valid item: ', cursor)
            }
        }
    },
    EDIT_LABEL: {
        key: 'L',
        help: 'Edit label of highlighted item',
        run: (e, root) => {

        }
    },
    NEW_SHORTCUT: {
        key: 'S',
        help: 'Create new shortcut',
        run: (e, root) => {
             root.apps.addItem(root.cursor);
        }
    },
    NEW_CATEGORY: {
        key: 'C',
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
            e.target.id === 'app-search-input' && e.target.blur();
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
            if (e.target?.id === 'app-search-input') {
                // create new
                throw new Error('Should not run enter action when in search text input');
            }

            if (cursor.startsWith('search_')) {
                let itemId = cursor.replace('search_', '');

                if (apps.isItem(itemId)) {
                    let item = apps.find(itemId);
                    apps.setActiveApp(item.app.id);
                    setCursor(itemId);
                    search.clearQuery();
                }
            }
        }
    },
    EXIT_SEARCH: {
        key: 'esc',
        help: null,
        run: (e, root) => {
            let { setCursor, search, apps, state } = root;
            search.clearQuery();
            setCursor(apps.topItem.id);
            state.setKeyScope('APP');
        }
    },
    'NEW_APP -> MAYBE_LATER': {
        key: 'esc',
        help: null,
        run: (e, root) => {
            root.state.clearUnknownAppName();
        }
    },
    'NEW_APP -> YES': {
        key: 'Y',
        help: null,
        run: (e, root) => {
            let { unknownApp } = root.state;
            root.apps.addNewApp(unknownApp, unknownApp);
            root.state.clearUnknownAppName();
        }
    },
    'NEW_APP -> NO': {
        key: 'N',
        help: null,
        run: (e, root) => {
            root.ui.addIgnoreApp(root.state.unknownApp);
            root.state.clearUnknownAppName();
        }
    }
};

/**
 * @typedef {Object} IKeyScopes
 * @property {object} config
 * @property {string} config.scope - name of scope
 * @property {boolean} [config.keydown=true] - trigger key actions on key down
 * @property {boolean} [config.keyup=false] - trigger key actions on key up
 * @property {string[]} actions - list of actions
 * @property {function(e: KeyboardEvent, scope: string)} eventFilter - function return true/false when input elements fire keyboard events
 */


/** @type Object.<string,IKeyScopes> */
export const key_scopes = {
    APP: {
        config: { scope: 'APP', keydown: true, keyup: false },
        actions: [
            'SHOW_HELP_MODAL',
            'FOCUS_SEARCH',
            'MOVE_CURSOR',
            'CHANGE_APP',
            'SELECT_ITEM',
            'MOVE_SELECTION',
            'DELETE_ITEM',
            'NEW_SHORTCUT',
            'NEW_CATEGORY',
            'EDIT_CURRENT_APP'
        ],
        eventFilter: (e, scope) => {
            if (scope && scope !== 'APP') {
                log.debug('APP deferring keyscope to: ' + scope);
                return false;
            }

            const ifAny = [
                e.target?.id === 'app-search-input',
                e.target.hasAttribute('contenteditable'),
                window.location.hash.startsWith('#HELP')
            ];

            return !ifAny.includes(true);
        }
    },
    HELP: {
        config: { scope: 'HELP', keydown: true, keyup: false },
        actions: [
            'CLEAR_CURSOR'
        ],
        eventFilter: (e) => window.location.hash === '#HELP'
    },
    SEARCH: {
        config: { scope: 'SEARCH', keydown: false, keyup: true },
        actions: [
            'EXIT_SEARCH', 'MOVE_SEARCH_CURSOR', 'SELECT_SEARCH_RESULT'
        ],
        eventFilter: (e) => e.target?.id === 'app-search-input'
    },
    SEARCH_BUTTONS: {
        config: { scope: 'SEARCH_BUTTONS', keydown: false, keyup: true },
        actions: [
            //, 'SELECT_SEARCH_RESULT'
        ],
        eventFilter: () => false
    },
    EDIT_ITEM: {
        config: { scope: 'EDIT_ITEM' },
        actions: [
            'CLEAR_EDIT_ITEM',
            'SAVE_EDIT_ITEM'
            //, 'NEXT_EDIT_FIELD'
        ],
        eventFilter: (e, scope) => scope === 'EDIT_ITEM'
    },
    EDIT_APP: {
        config: { scope: 'EDIT_APP' },
        actions: [
            'CLEAR_EDIT_APP'
        ],
        eventFilter: (e, scope) => scope === 'EDIT_APP'
    },
    CAPTURE: {
        config: { scope: 'CAPTURE', keydown: true, keyup: true },
        actions: [
            'CLEAR_EDIT_ITEM'
        ],
        eventFilter: (e) => e.target.id === 'capture-box' // TODO; still need this?
    },
    NEW_APP: {
        config: { scope: 'NEW_APP', keydown: false, keyup: true },
        actions: [
            'SHOW_HELP_MODAL',
            'NEW_APP -> MAYBE_LATER',
            'NEW_APP -> YES',
            'NEW_APP -> NO'
        ],
        eventFilter: (e, scope) => scope === 'NEW_APP'
    }
}

