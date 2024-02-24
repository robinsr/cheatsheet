import { getPath, getType, resolvePath, tryResolve } from 'mobx-state-tree';
import { getKeyDirection } from 'utils/dom.js';
import { getLogger } from 'utils/logger.js';
import { EDIT_APP, HELP, IGNORE_APPS, ITEM, SEARCH, SIDEBAR } from 'utils/paths'
const log = getLogger('KeyConfig');

// TODO move to model utils
const isNamed = (obj, expectedName) => {
    return getType(obj)?.name === expectedName;
}

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
    GO_BACK: {
        key: 'esc',
        help: null,
        run: (e, root) => {
            root.history.back();
        }
    },
    CLEAR_CURSOR: {
        key: 'esc',
        help: null,
        run: (e, root) => {
            root.history.push('#');
        }
    },
    SHOW_IGNORE_APPS: {
        key: 'i',
        help: 'Show ignored apps',
        run: (e, root) => {
            root.history.breadcrumb();
            root.history.push(IGNORE_APPS.link());
        }
    },
    SHOW_HELP_MODAL: {
        key: 'shift+/,?',
        help: 'Show this help window',
        run: (e, root) => {
            root.history.breadcrumb();
            root.history.push(HELP.link());
        }
    },
    SHOW_MENU: {
        key: 'm',
        help: 'Show sidebar menu',
        run: (e, root) => {
            root.history.breadcrumb();
            root.history.push(SIDEBAR.link());
        }
    },
    FOCUS_SEARCH: {
        key: '/',
        help: 'Go to search',
        run: (e, root) => {
            root.history.breadcrumb();
            root.history.push(SEARCH.link());
        }
    },
    CHANGE_APP: {
        key: 'right, left',
        help: 'Change the app in view',
        run: (e, root) => {
            let { path } = root.history;
            let app = resolvePath(root, path);

            if (app) {
                let direction = getKeyDirection(e);

                if (direction.RIGHT) {
                    root.setCursor(root.apps.next(app.id).path)
                } else if (direction.LEFT) {
                    root.setCursor(root.apps.prev(app.id).path)
                }
            }
        }
    },
    MOVE_ITEM_CURSOR: {
        key: 'up, down',
        help: 'Move highlight up or down',
        run: (e, root) => {
            let direction = getKeyDirection(e);
            let { hash, path, push, replace } = root.history;

            try {
                let item = tryResolve(root, hash.replace('#', ''));

                if (item && direction.DOWN && item.next) {
                    return replace('#' + item.next.path);
                }

                if (item && direction.UP && item.prev) {
                    return replace('#' + item.prev.path);
                }

                let app = tryResolve(root, path);

                if (app && direction.DOWN && app.topItem?.path) {
                    return push('#' + app.topItem?.path);
                }

                if (app && direction.UP && app.bottomItem?.path) {
                    return push('#' + app.bottomItem?.path);
                }
            } catch (e) {
                console.error(e);
            }
        }
    },
    SELECT_ITEM: {
        key: 'E, enter',
        help: 'Open focused shortcut in edit pane',
        run: (e, root) => {
            let { hash, push } = root.history;

            // TODO; search bar does not have its own scope
            if (e.target?.id === 'app-search-input') {
                log.warn('TODO: search bar does not have its own scope')
                return;
            }

            try {
                let item = tryResolve(root, hash.replace('#', ''));

                if (item) {
                    root.history.breadcrumb();
                    push(hash + '/edit/field=label');
                } else {
                    log.warn('Enter key pressed, but cursor value is not valid item: ', hash);
                }
            } catch (e) {
                console.error(e);
            }
        }
    },
    MOVE_SELECTION: {
        key: 'shift+up, shift+down',
        help: 'Move highlighted item up or down',
        run: (e, root) => {
            let { hash, replace } = root.history;
            let direction = getKeyDirection(e);
            let item = resolvePath(root, hash.replace('#', ''));

            if (item) {
                if (direction.UP) {
                    item.category.swapItems(item.prev, item);
                    replace('#' + getPath(item));
                } else {
                    item.category.swapItems(item, item.next);
                    replace('#' + getPath(item));
                }
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
            // what to do really depends on the cursor
            let { path, hash, replace } = root.history;

            let item = resolvePath(root, hash.replace('#', ''));

            if (item) {
                let id = item.category.addItem('New Shortcut', item.id);
                return;
            }

            // If just /apps/appList/i
        }
    },
    NEW_CATEGORY: {
        key: 'C',
        help: 'Create a new category in current app',
        run: (e, root) => {

        }
    },
    CLEAR_EDIT_ITEM: {
        key: 'esc',
        help: 'Exit edit shortcut pane',
        run: (e, root) => {
            root.history.back();
        }
    },
    SAVE_EDIT_ITEM: {
        key: 'enter,command+S',
        help: 'Save edit item',
        run: (e, root) => {
            // do nothing, handled in EditItemModal
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
            let { path, hash, push } = root.history;
            let app = tryResolve(root, path);

            if (app && isNamed(app, 'MobxAppItem')) {
                push(app.path + '/edit#field=name');
            }
        }
    },
    CLEAR_EDIT_APP: {
        key: 'esc',
        help: null,
        run: (e, root) => {
            root.history.back();
        }
    },
    SAVE_EDIT_APP: {
        key: 'enter',
        help: null,
        run: (e, root) => {
            // do nothing, handled in EditAppModal
        }
    },
    SELECT_FIRST_RESULT: {
        key: 'down',
        help: null,
        run: (e, root) => {
            let { search, state } = root;
            let { hash, replace, breadcrumb } = root.history;

            if (search.first) {
                breadcrumb();
                replace('#search' + search.first.path);
                state.setKeyScope('SEARCH_RESULTS');
            }
        }
    },
    MOVE_SEARCH_CURSOR: {
        key: 'up,down',
        help: null,
        run: (e, root) => {
            let direction = getKeyDirection(e);
            let { search } = root;
            let { hash, replace } = root.history;

            if (hash?.startsWith('#search')) {
                let itemPath = hash.replace('#search', '');
                if (direction.UP) {
                    replace('#search' + search.prev(itemPath, 'path').path);
                } else {
                    replace('#search' + search.next(itemPath, 'path').path);
                }
            } else if (search.first) {
                replace('#search' + search.first.path);
            }
        }
    },
    SELECT_SEARCH_RESULT: {
        key: 'enter',
        help: null,
        run: (e, root) => {
            if (e.target?.classList.contains('search-result')) {
                e.target.click();
            }
        }
    },
    EXIT_SEARCH: {
        key: 'esc',
        help: null,
        run: (e, root) => {
            let { history, search, apps, state } = root;
            state.setKeyScope('APP');
            search.clearQuery();
            history.back();
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
            let { unknownApp } = root.state;
            root.settings.addIgnoreApp(unknownApp);
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
        config: { scope: 'APP', keydown: false, keyup: true },
        actions: [
            'CLEAR_CURSOR',
            'SHOW_HELP_MODAL',
            'SHOW_IGNORE_APPS',
            'FOCUS_SEARCH',
            'MOVE_ITEM_CURSOR',
            'CHANGE_APP',
            'SELECT_ITEM',
            'MOVE_SELECTION',
            'DELETE_ITEM',
            'NEW_SHORTCUT',
            'NEW_CATEGORY',
            'EDIT_CURRENT_APP',
            'SHOW_MENU'
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
    MODAL: {
        config: { scope: 'MODAL', keydown: false, keyup: true },
        actions: [
            'GO_BACK'
        ],
        eventFilter: (e, scope) => scope === 'MODAL'
    },
    SEARCH: {
        config: { scope: 'SEARCH', keydown: false, keyup: true },
        actions: [
            'EXIT_SEARCH', 'SELECT_FIRST_RESULT'
        ],
        eventFilter: (e) => e.target?.id === 'app-search-input'
    },
    SEARCH_RESULTS: {
        config: { scope: 'SEARCH_RESULTS', keydown: false, keyup: true },
        actions: [
            'SELECT_SEARCH_RESULT', 'MOVE_SEARCH_CURSOR', 'GO_BACK'
        ],
        eventFilter: (e) => e.target.classList.contains('search-result')
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
        config: { scope: 'EDIT_APP', keydown: false, keyup: true },
        actions: [
            'CLEAR_EDIT_APP',
            'SAVE_EDIT_APP'
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

// disable window scroll
// TODO move somewhere that makes sense
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
