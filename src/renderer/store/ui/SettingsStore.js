import { flow, getEnv, getSnapshot, types } from 'mobx-state-tree';
import { getLogger } from 'utils';

const log = getLogger('SettingsStore');

/**
 * Contains "user-settings" -like properties that are to be persisted
 * @typedef {object} ISettingsStore
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
     * @name ISettingsStore#toogleTheme
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

const MobxSettingsStore = types
    .model('SettingsStore', {
        theme: types.enumeration('theme', ['light', 'dark']),
        activeFollow: types.boolean,
        ignoreApps: types.array(types.string)
    })
    .actions(SettingsStoreActions);

MobxSettingsStore.__defaults = {
    theme: 'dark',
    activeFollow: true
};

export default MobxSettingsStore;
