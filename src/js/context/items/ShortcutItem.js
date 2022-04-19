import escape from 'markdown-escape';
import short from 'short-uuid';

import render from 'utils/canvas_renderer';

const uuid = short();

class ShortcutItem {
    constructor(config, is_new = false) {
        let { category, label, cmd, id } = config;

        Object.assign(this, { id, category, label, cmd, image_data: null });

        if (!id || is_new) {
            this.id = uuid.new();
        }

        if (is_new) {
            this.is_new = true
        }
    }

    update_image_data = (image_data) => {
        this.image_data = image_data;
    }

    attach_ref = (ref) => {
        this.ref = ref;
    }

    fetch_image_data = () => {
        let { image_data, ref } = this;
        let item = this;

        return new Promise(resolve => {
            if (image_data != null) {
                resolve(image_data);
                return;
            } else {
                render(ref.current)
                    .then(image_data => {
                        item.update_image_data(image_data);
                        resolve(image_data)
                    })
            }
        })
    }

    get_markdown_string = () => {
        let { image_data, category, label, cmd } = this;

        if (image_data != null) {
            return `|${escape(category)}|${escape(label)}|![${escape(label)}](${image_data.data_url})|`
        } else {
            return `|${escape(category)}|${escape(label)}|${escape(cmd)}|`
        }
    }
}

export default ShortcutItem;
