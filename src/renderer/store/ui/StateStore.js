import { types } from 'mobx-state-tree';

/**
 * Contains values that do not need to be persisted and are Subject to frequent changes
 * @typedef {object} StateStore
 * @property {boolean} isLoading
 * @property {boolean} isSaving
 * @property {?string} activeWindow
 * @property {?string} keyScope
 * @property {string} unknownApp
 */

const MobxStateStore = types
.model({
    isLoading: types.optional(types.boolean, true),
    isSaving: types.optional(types.boolean, false),
    activeWindow: types.maybeNull(types.string),
    keyScope: types.maybeNull(types.string),
    unknownApp: types.maybeNull(types.string)
})
.actions(self => ({
    /**
     * Sets active window
     * @name StateStore#setActiveWindow
     * @param {string} name
     */
    setActiveWindow(name) {
        self.activeWindow = name;
    },
    /**
     * @name StateStore#setKeyScope
     * @param {string} val
     */
    setKeyScope(val) {
        self.keyScope = val;
    },
    /**
     * @name StateStore#loading
     * @param {boolean} val
     */
    loading(val) {
        self.isLoading = val;
    },
    /**
     * @name StateStore#saving
     * @param {boolean} val
     */
    saving(val) {
        self.isSaving = val;
    },
    /**
     * @name StateStore#setUnknownAppName
     * @param {string} appName
     */
    setUnknownAppName(appName) {
        self.unknownApp = appName
    },
     /**
     * @name StateStore#clearUnknownAppName
     */
    clearUnknownAppName() {
        self.unknownApp = null;
    },
}));

MobxStateStore.__defaults = {
    isLoading: true,
    isSaving: false,
    activeWindow: window.cheatsheetAPI.config.get('name'),
    keyScope: null,
    unknownApp: null
}

export default MobxStateStore;
