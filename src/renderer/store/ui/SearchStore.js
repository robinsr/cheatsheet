import { getParent, types } from 'mobx-state-tree';
import Optional from 'optional-js';
import MobxShortcutItem from 'store/app/ShortcutItem';
import { decrement, increment } from 'utils';


const MobxSearchStore = types.model('SearchStore', {
    query: types.maybeNull(types.string),
    results: types.array(types.reference(MobxShortcutItem))
})
.views(self => ({
    index(id) {
        if (!id) throw new Error('No ID supplied');

        return Optional.ofNullable(self.results.findIndex(i => i.id === id))
            .orElseThrow(() => new Error(`Item '${id}' not found in category ${self.name}`));
    },
    at(i) {
        return self.results[i];
    },
    next(id) {
        return Optional.of(id)
            .map(self.index).map(increment).map(self.at)
            .orElse(self.first);
    },
    prev(id) {
        return Optional.of(id)
            .map(self.index).map(decrement).map(self.at)
            .orElse(self.last);
    },
    get first() {
        return self.results[0];
    },
    get last() {
        return self.results[self.results.length - 1];
    }
}))
.actions(self => ({
    updateQuery(val) {
        self.query = val;
        self.results = getParent(self).apps.query(val);
    },
    clearQuery() {
        self.query = '';
        self.results = [];
    }
}));

export default MobxSearchStore;
