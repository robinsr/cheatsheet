import { types } from 'mobx-state-tree';
import { CustomImage } from 'utils/images';

export const MobxCustomImage = types.custom({
    name: 'MobxCustomImage',
    fromSnapshot(value) {
        CustomImage.fromSnapshot(value);
    },
    toSnapshot(instance) {
        return instance;
    },
    isTargetType(value) {
        if (!value) return false;

        if (typeof value == 'object') {
            if (value && value instanceof CustomImage) {
                return true;
            }
        }

        return false;
    },
    getValidationMessage(instance) {
        if (instance && instance.type) return '' // OK
        return `'${instance}' doesn't look like a valid image`
    }
});
