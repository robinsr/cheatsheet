import { types } from "mobx-state-tree";
import { MobxAppItem, MobxCategoryItem } from "context/models/AppStore";

export const MobxShortcutItem = types
    .model('MobxShortcutItem', {
        id: types.identifier,
        app: types.maybeNull(types.reference(MobxAppItem)),
        category: types.maybeNull(types.reference(MobxCategoryItem)),
        label: types.maybeNull(types.string),
        command: types.maybeNull(types.string)
    })
    .views(self => {
        return {
            get markdown() {
                return `|${self.label}|${self.command}|`; // todo; complete md string
            },

            getResultsSplit(q) {
                let query = new RegExp('(' + q + ')', 'i');
                let split = self.label.split(query);

                if (split.length > 1) {
                    return [ split[0], split[1], split.slice(2).join('') ]
                } else {
                    return [];
                }
            }
        }
    })
    .actions(self => {
        let ref = null; // will store a reference to dom ref for data/image purposes

        return {
            setRef: (reactRef) => {
                ref = reactRef;
            },
            update: (attr, value) => {
                self[attr] = value;
            },
            getDataImage: () => {
                return new Promise((res, rej) => {
                    render(ref.current).then(imageData => resolve(imageData));
                });
            },
            beforeDestroy: () => {
                console.log('I am being destroyed! ', self.label, self.id)
            }
        }
    })