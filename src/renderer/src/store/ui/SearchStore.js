import { getParent, types } from 'mobx-state-tree';
import MobxShortcutItem from 'store/app/ShortcutItem';
import MobxCollection from 'store/types/Collection';

/**
 * @typedef {object} SearchStore
 * @property {?string} query
 * @property {object[]} results
 */

const SearchStore = types.model('SearchStore', {
    query: types.maybeNull(types.string),
    results: types.array(types.reference(MobxShortcutItem))
})
.actions(self => ({
    /**
     * @name SearchStore#updateQuery
     * @param {string} val
     */
    updateQuery(val) {
        self.query = val;
        self.results = getParent(self).apps.query(val);
    },
    /**
     * @name SearchStore#clearQuery
     */
    clearQuery() {
        self.query = '';
        self.results = [];
    }
}));

const MobxSearchStore = types.compose(
    MobxCollection(MobxShortcutItem, { propName: 'results' }), SearchStore
    ).named('MobxSearchStore');

MobxSearchStore.__defaults = {
    query: '',
    results: []
};

export default MobxSearchStore;
