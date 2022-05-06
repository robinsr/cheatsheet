import { types } from 'mobx-state-tree';
import { CustomImage } from 'utils/images.js';

const MobxCustomImage = types.custom({
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
        if (instance && instance.type) return "" // OK
        return `'${instance}' doesn't look like a valid image`
    }
})

/**
 * @typedef {object} ImageModalStore
 * @property {boolean} showModal
 * @property {CustomImage} data
 */

const MobxImageModalStore = types
    .model('MobxImageModal', {
        showModal: types.boolean,
        data: types.maybeNull(MobxCustomImage)
    })
    .actions(self => ({
        /**
         * @name ImageModalStore#setImageData
         * @param {CustomImage} data
         */
        setImageData(data) {
            self.data = data;
            self.showModal = true;
        },
        /**
         * @name ImageModalStore@closeModal
         */
        closeModal() {
            self.showModal = false;
        }
    }));

MobxImageModalStore.__defaults = {
    data: null,
    showModal: false
};

export default MobxImageModalStore;
