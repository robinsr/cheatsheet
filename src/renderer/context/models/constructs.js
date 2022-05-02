import {types} from 'mobx-state-tree';

export const MobxOrderedItem = types
    .model({
        id: types.identifier,
        order: types.maybeNull(types.number)
    })
    .actions(self => ({
        serOrder(index) {
            self.index = index;
        }
    }));

export const MobxNamedItem = types
    .model({
        id: types.identifier,
        name: types.string
    })
    .actions(self => ({
        updateName(name) {
            self.name = name
        }
    }));
