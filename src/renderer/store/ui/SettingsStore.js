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

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const systemTheme = darkModeQuery.matches ? Themes.night : Themes.day;

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
        log.info('Saving SettingsStore')
        try {
            const result = yield getEnv(self).cheatsheetAPI.settings.save(getSnapshot(self));
            log.info('SettingsStore saved', result);
        } catch (err) {
            log.error('SettingsStore save failed', err);
            log.error(err);
        }
    }),
    /**
     * Enable Dark mode
     * @name ISettingsStore#night
     */
    night() {
        self.theme = Themes.night
    },
    /**
     * Disable Dark mode
     * @name ISettingsStore#day
     */
    day() {
        self.theme = Themes.day
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
     * @name ISettingsStore#addIgnoreApp
     * @param {string} appName
     */
    addIgnoreApp(appName) {
        self.ignoreApps.unshift(appName);
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
    get isDarkMode() {
        return self.theme === Themes.night;
    }
});


/**
 * Contains "user-settings" -like properties that are to be persisted
 * @typedef {object} ISettingsStore
 * @property {Themes} theme
 * @property {KeyThemes} keyTheme
 * @property {boolean} activeFollow
 * @property {string[]} ignoreApps
 */
const MobxSettingsStore = types
    .model('SettingsStore', {
        theme: types.optional(types.enumeration('theme', ['day', 'night']), 'day'),
        keyTheme: types.enumeration('keyTheme', ['light', 'dark']),
        activeFollow: types.boolean,
        ignoreApps: types.array(types.string)
    })
    .views(SettingsStoreViews)
    .actions(SettingsStoreActions);

MobxSettingsStore.__defaults = {
    keyTheme: 'dark',
    theme: systemTheme,
    activeFollow: true,
    ignoreApps: []
};

export default MobxSettingsStore;