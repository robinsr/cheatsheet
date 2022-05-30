import { types } from 'mobx-state-tree';
import { createHashHistory } from 'history';
import HistoryTransition from 'store/types/Transition';
import { getLogger } from 'utils';

const log = getLogger('CursorStore');

export const history = createHashHistory();

/**
 * @class IHistoryActions
 * @param {IHistoryStore} self
 * @constructor
 */
const HistoryActions = self => ({
    push(val) {
        if (typeof val !== 'string') {
            val = val.toString();
        }

        history.push(val);
    },
    replace(val) {
        if (typeof val !== 'string') {
            val = val.toString();
        }

        history.replace(val);
    },
    back() {
        history.back();
    },
    breadcrumb() {
        // create an entry for current location
        history.push(self.location);
    },
    listen() {
        log.info('Init window.pushState listener')

        history.listen(({ action, location }) => {
            log.debug('history event:', action, location);
            self._update(location);
        });
    },
    _update(location) {
        let { pathname, hash } = location;
        self.path = pathname;
        self.hash = hash;
    },
    afterCreate() {
        self.listen();

        history.push('/'); // restart at index
    },

    subscribe(transition) {
        self.transitions.push(transition);
    }
});

/**
 * @class IHistoryViews
 * @param {IHistoryStore} self
 * @constructor
 */
const HistoryViews = self => ({
    get cursor() {
        return self.path + self.hash;
    },
    get location() {
        return self.path + self.hash;
    },
    get state() {
        return history.location.state;
    }
});


/**
 * @typedef {object} IHistoryProps
 * @prop {string} path
 * @prop {string} hash
 * @prop {object[]} transitions
 */
export const MobxHistoryStore = types.model({
    path: types.optional(types.string, '/'),
    hash: types.optional(types.string, '#'),
    transitions: types.array(HistoryTransition)
})
.views(HistoryViews)
.actions(HistoryActions);

MobxHistoryStore.__defaults = {
    path: '/',
    hash: '#',
    transitions: []

}

/**
 * @typedef { IHistoryProps, IHistoryViews, IHistoryActions } IHistoryStore
 */
