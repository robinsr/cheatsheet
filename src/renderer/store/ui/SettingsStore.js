import { flow, getEnv, getSnapshot, types } from 'mobx-state-tree';
import { getLogger } from 'utils';

const log = getLogger('SettingsStore');

/**
 * @enum {string}
 */
export const KeyThemes = {
    light: 'light',
    dark: 'dark'
}

/**
 * Night mode values
 * @enum {string}
 */
export const Themes = {
    night: 'night',
    day: 'day'
}

const ThemeValues = Object.values(Themes);
const SysThemeModel = types
    .model('sysTheme', {
        current: types.enumeration('keyTheme', ThemeValues)
    })
    .actions(self => ({
        setTheme(theme) {
            self.current = theme;
        }
    }));

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const sysTheme = SysThemeModel.create({
    current: darkModeQuery.matches ? Themes.night : Themes.day
});

darkModeQuery.onchange = e => {
    sysTheme.setTheme(e.matches ? Themes.night : Themes.day);
};

/**
 * SettingsStore actions
 * @param {ISettingsStore} self
 * @constructor
 */
const SettingsStoreActions = (self) => ({
    load: flow(function* loadApps() {
        log.info('Fetching SettingsStore...');
        try {
            let result = yield getEnv(self).cheatsheetAPI.settings.get();
            log.info('Fetched SettingsStore', result);
            Object.assign(self, result);
        } catch (err) {
            log.error(err);
        }
    }),
    save: flow(function* saveApps() {
        log.info('Saving SettingsStore');
        try {
            const result = yield getEnv(self).cheatsheetAPI.settings.save(getSnapshot(self));
            log.info('SettingsStore saved', result);
        } catch (err) {
            log.error('SettingsStore save failed', err);
            log.error(err);
        }
    }),
    /**
     * Sets the user's preferred theme
     * @name ISettingsStore#setUserTheme
     */
    setUserTheme(theme) {
        self.userTheme = theme;
    },
    /**
     * @name ISettingsStore#toggleKeyTheme
     */
    toggleKeyTheme() {
        switch (self.keyTheme) {
            case KeyThemes.light:
                self.keyTheme = KeyThemes.dark;
                break;
            case KeyThemes.dark:
                self.keyTheme = KeyThemes.light;
                break;
        }
    },
    /**
     * @name ISettingsStore#toggleActiveFollow
     */
    toggleActiveFollow() {
        self.activeFollow = !self.activeFollow;
    },
    /**
     * @name ISettingsStore#toggleAlwaysOnTop
     */
    toggleAlwaysOnTop() {
        self.alwaysOnTop = !self.alwaysOnTop;
    },
    /**
     * @name ISettingsStore#toggleSystemTheme
     */
    toggleSystemTheme() {
        self.useSystemTheme = !self.useSystemTheme;
    },

    /**
     * @name ISettingsStore#addIgnoreApp
     * @param {string} appName
     */
    addIgnoreApp(appName) {
        if (self.ignoreApps.indexOf(appName) === -1) {
            self.ignoreApps.unshift(appName);
        }
    }
});


/**
 * SettingsStore computed views
 * @param {ISettingsStore} self
 * @constructor
 */
const SettingsStoreViews = self => ({
    /**
     * @name ISettingsStore#isDarkMode
     * @returns {boolean}
     */
    get userPrefersNight() {
        return self.userTheme === Themes.night;
    },

    /**
     * @name ISettingsStore#theme
     * @returns {Themes}
     */
    get theme() {
        return self.useSystemTheme ? sysTheme.current : self.userTheme;
    }
});


/**
 * Contains "user-settings" -like properties that are to be persisted
 * @typedef {object} ISettingsStore
 * @property {boolean} useSystemTheme
 * @property {Themes} userTheme
 * @property {KeyThemes} keyTheme
 * @property {boolean} activeFollow
 * @property {boolean} alwaysOnTop
 * @property {string[]} ignoreApps
 */
const MobxSettingsStore = types
    .model('SettingsStore', {
        useSystemTheme: types.boolean,
        userTheme: types.enumeration('theme', ThemeValues),
        keyTheme: types.enumeration('keyTheme', ['light', 'dark']),
        activeFollow: types.boolean,
        alwaysOnTop: types.boolean,
        ignoreApps: types.array(types.string)
    })
    .views(SettingsStoreViews)
    .actions(SettingsStoreActions);

MobxSettingsStore.__defaults = {
    keyTheme: 'dark',
    userTheme: sysTheme.current,
    useSystemTheme: true,
    activeFollow: true,
    alwaysOnTop: false,
    ignoreApps: []
};

export default MobxSettingsStore;