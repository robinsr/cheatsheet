import { types } from 'mobx-state-tree';
import { MobxKey } from 'store/types/Key';
import { newUuid } from 'utils';

export const SEPARATOR = '+';

const MobxShortcutModel = types.model('MobxShortcutModel', {
    keys: types.optional(types.array(MobxKey), [])
})
.views(self => ({
    get id() {
        return newUuid();
    }
}));

export const MobxShortcut = types.snapshotProcessor(MobxShortcutModel, {
    // from snapshot to instance (eg. de-serialize)
    preProcessor(shortcut) {
        return {
            keys: shortcut.split(SEPARATOR).map(i => ({ value: i.trim() }))
        }
    },
    // from instance to snapshot (eg. serialize)
    postProcessor(shortcut) {
        if (typeof shortcut === 'string') {
            return shortcut;
        }
        return shortcut.keys.map(key => key.value).join(SEPARATOR);
    }
});
