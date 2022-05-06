import { types } from 'mobx-state-tree';

/**
 * @typedef {object} UIStore
 * @property {Themes} theme
 * @property {boolean} activeFollow
 * @property {string[]} ignoreApps
 */

/**
 * @enum {string}
 */
export const Themes = {
    light: 'light',
    dark: 'dark'
}

const UIStore = types
    .model('UIStore', {
        theme: types.enumeration('theme', ['light', 'dark']),
        activeFollow: types.boolean,
        ignoreApps: types.array(types.string)
    })
    .actions(self => ({
        /**
         * @name UIStore#toogleTheme
         */
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
        /**
         * @name UIStore#toggleActiveFollow
         */
        toggleActiveFollow() {
            self.activeFollow = !self.activeFollow;
        }
    }));

UIStore.__defaults = {
    theme: 'dark',
    activeWindow: window.cheatsheetAPI.configVal('name'),
    activeFollow: true
};

export default UIStore;
