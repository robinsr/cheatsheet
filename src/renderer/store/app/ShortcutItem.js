import { getParent, types } from 'mobx-state-tree';

const MobxShortcutItem = types
    .model('MobxShortcutItem', {
        id: types.identifier,
        label: types.maybeNull(types.string),
        command: types.maybeNull(types.string),
        secondary: types.maybeNull(types.string)
    })
    .views(self => {
        let app, category = null;

        return {
            afterCreate() {
                // app = getParent(self, 4);
                // category = getParent(self, 2);
            },
            get app() {
                return getParent(self, 4);
                //return app;
            },
            get category() {
                return getParent(self, 2)
                // return category;
            },
            get next() {
                return getParent(self, 2).next(self.id);
            },
            get prev() {
                return getParent(self, 2).prev(self.id);
            },
            get markdown() {
                return `|${self.label}|${self.command}|`; // todo; complete md string
            },
            getResultsSplit(q) {
                let query = new RegExp('(' + q + ')', 'i');
                let split = self.label.split(query);

                if (split.length > 1) {
                    return [split[0], split[1], split.slice(2).join('')]
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
                // TODO: fix this
                return new Promise((resolve, rej) => {
                    render(ref.current).then(imageData => resolve(imageData));
                });
            },
            beforeDestroy: () => {
                console.log('I am being destroyed! ', self.label, self.id)
            }
        }
    });

export default MobxShortcutItem;


