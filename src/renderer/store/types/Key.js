import { types } from 'mobx-state-tree';
import { formatKey } from 'utils/macos_symbols';

/**
 * Display preferences for symbols
 * @type {{disableSymbols: boolean, numpadEnabled: boolean}}
 */
const prefs = {
    useNumpad: false,
    useSymbols: true
}


export const MobxKey = types.model('MobxKey', {
    value: types.optional(types.string, '')
})
.views(self => ({
    /**
     * Returns single character for display
     */
    get symbol() {
        return formatKey(self.value, prefs);
    },

    /**
     * Short display string
     */
    get abbr() {
        return formatKey(self.value, prefs);
    },

    /**
     * Full display name
     */
    get name() {
        return formatKey(self.value, prefs);
    }
}))