import { types } from 'mobx-state-tree';

export const Themes = {
    light: 'light',
    dark: 'dark'
}

export const UI = types
    .model({
        theme: types.enumeration('theme', ['light', 'dark'])
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
        }
    }));

