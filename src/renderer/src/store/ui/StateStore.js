import { detach, types } from 'mobx-state-tree';
import { Answer, PromiseState, Proposition } from 'store/types/Proposition.js';



/**
 * Contains values that do not need to be persisted and are Subject to frequent changes
 * @typedef {StateActions} StateStore
 * @property {boolean} isLoading
 * @property {boolean} isSaving
 * @property {?string} activeWindow
 * @property {?string} keyScope
 * @property {string} unknownApp
 * @property {IProposition} userPrompt
 */

const StateModelProps = {
    isLoading: types.optional(types.boolean, true),
    isSaving: types.optional(types.boolean, false),
    activeWindow: types.maybeNull(types.string),
    keyScope: types.maybeNull(types.string),
    unknownApp: types.maybeNull(types.string),
    userPrompt: types.maybeNull(Proposition)
};

/**
 * @class StateActions
 * @constructor
 * @param {StateStore} self
 */
const StateActions = self => ({
    /**
     * Sets active window
     * @param {string} name
     */
    setActiveWindow(name) {
        self.activeWindow = name;
    },
    /**
     * @param {string} val
     */
    setKeyScope(val) {
        self.keyScope = val;
    },
    /**
     * @param {boolean} val
     */
    loading(val) {
        self.isLoading = val;
    },
    /**
     * @param {boolean} val
     */
    saving(val) {
        self.isSaving = val;
    },
    /**
     * @param {string} appName
     */
    setUnknownAppName(appName) {
        self.unknownApp = appName
    },
     /**
     */
    clearUnknownAppName() {
        self.unknownApp = null;
    },
    /**
     * @returns {Promise<PropResponse>}
     */
    setPromptValueAndWait(val) {
        if (self.userPrompt) {
            return Promise.reject(new Error('Cannot have simultaneous user prompts'));
        }

        self.userPrompt = Proposition.create({
            statement: val
        });

        self.userPrompt.getPromise().finally(() => {
            self.clearPrompt();
        });

        return self.userPrompt.getPromise();
    },
    clearPrompt() {
        if (self.userPrompt?.getState() === PromiseState.PENDING) {
            self.userPrompt.getPromise().resolve(Answer.CANCEL);
        }

        self.userPrompt = null;
    }
});


const MobxStateStore = types.model(StateModelProps).actions(StateActions);

MobxStateStore.__defaults = {
    isLoading: true,
    isSaving: false,
    activeWindow: window.cheatsheetAPI.config.get('name'),
    keyScope: 'APP',
    unknownApp: null,
    userPrompt: null
}

export default MobxStateStore;
