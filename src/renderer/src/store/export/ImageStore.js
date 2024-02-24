import { types } from 'mobx-state-tree';
import { MobxCustomImage } from 'store/types/Image';
import { CustomImage } from 'utils/images.js';

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
