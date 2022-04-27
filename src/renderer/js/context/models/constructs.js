import {types} from "mobx-state-tree";

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
