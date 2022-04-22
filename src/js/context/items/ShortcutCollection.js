import ShortcutItem from './ShortcutItem';
import groupBy from 'lodash/groupBy';
import pick from 'lodash/pick';
import short from 'short-uuid';

const uuid = short();

async function get_all_images(all_items, progress_cb = () => {}) {
    return new Promise(async (resolve) => {
        for (let item of all_items) {
            var o = await item.fetch_image_data();
            progress_cb(Math.floor(all_items.indexOf(item) / all_items.length * 100));
        }
        resolve();
    });
}


export class ShortcutCollection {
    constructor(updater) {
        this.updater = updater;

        // TODO: Add as parameter
        this.items = [] 
        
        this.item_groups = [];
        this.new_item = null;
        this.edit_item = null;

        this.show_markdown = false;
        this.markdown_val = null;
        this.show_image_modal = false;
        this.image_data = null

        if (!window.keymap_api) {
            throw new Error('No keymap_api found')
        } else {
            window.keymap_api.getInitialData()
                .then(data => {
                    this.items = data.map(i => {
                        return new ShortcutItem(Object.assign({}, i, { id: uuid.new() }));
                    });

                    this.normalize();
                })
        }
    }

    /**
     * After mutating any object, call normalize to recalculate
     * model values and call updater
     */
    normalize = () => {
        let item_groups = Object.keys(groupBy(this.items, i => i.category));

        let new_item = this.items.find(i => i.is_new);

        let edit_item = this.items.find(i => i.is_editing);

        Object.assign(this, { item_groups, new_item, edit_item })

        this.updater({ item_groups, new_item, edit_item, items: this.items })
    }

    add_item = (config) => {
        this.items.push(new ShortcutItem(config, true));
        this.normalize();
    }

    update_item = (config) => {
        let item = this.items.find(i => i.id == config.id);

        if (item) {
            Object.assign(item, config)
        }

        this.normalize();
    }

    remove_item = (config) => {
        this.items = this.items.filter(i => i.id != config.id);
        this.normalize();
    }

    show_image = (image_data) => {
        this.updater({
            show_image_modal: true,
            image_data
        })
    }

    export = () => {
        this.updater({ show_markdown: true });

        let progress = (update) => {
            this.updater({ progress: update });
        }

        get_all_images(this.items, progress)
            .then(() => this.export_markdown());
    }

    export_markdown = (group) => {
        let items = this.items;

        if (group) {
            items = items.filter(i => i.category == group);
        }

        let rows = items.map(item => item.get_markdown_string()).join('\n');

        let header = [
            '|Category|Name|Command|',
            '|--------|----|-------|'
        ].join('\n');

        this.markdown_val = [ header, rows ].join('\n');
        this.show_markdown = true;

        let { markdown_val, show_markdown } = this;
        this.updater({ markdown_val, show_markdown });
    }

    close_export_window = () => {
        this.updater({
            show_markdown: false,
            show_image_modal: false
        });
    }
}

export default ShortcutCollection;
