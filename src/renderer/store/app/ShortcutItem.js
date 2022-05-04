import { getParent, getPath, types } from 'mobx-state-tree';

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

            get link() {
                console.log(getPath(self));
                let path = `/apps/${self.app.id}/category/${self.category.id}/item/${self.id}`;
                console.log(path);
                return path;
            },

            get markdown() {
                return `|${self.label}|${self.command}|`; // todo; complete md string
            },

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


