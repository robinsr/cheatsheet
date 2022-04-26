import { types } from 'mobx-state-tree';
import { pick as _pick } from 'lodash';

import { CustomImage, CustomSVGImage, CustomPNGImage } from 'utils/images';


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


const MobxImageModal = types
    .model('MobxImageModal', {
        showModal: types.boolean,
        data: types.maybeNull(MobxCustomImage)
    })
    .actions(self => ({
        setImageData(data) {
            self.data = data;
            self.showModal = true;
        },

        closeModal() {
            self.showModal = false;
        }
    }));

export { MobxImageModal };

