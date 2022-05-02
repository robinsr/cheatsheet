import { types } from 'mobx-state-tree';

export const Themes = {
    light: 'light',
    dark: 'dark'
}

const UIStore = types
    .model('UIStore', {
        theme: types.enumeration('theme', ['light', 'dark']),
        activeWindow: types.maybeNull(types.string),
        activeFollow: types.boolean,
        ignoreApps: types.array(types.string)
    })
    .actions(self => ({
        toggleTheme() {
            switch (self.theme) {
                case Themes.light:
                    self.theme = Themes.dark;
                    break;
                case Themes.dark:
                    self.theme = Themes.light;
                    break;
            }
        },
        setActiveWindow(name) {
            self.activeWindow = name;
        },
        toggleActiveFollow() {
            self.activeFollow = !self.activeFollow;
        }
    }));

export default UIStore;
