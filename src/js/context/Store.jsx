import React, { Component, createContext } from 'react';
import escape from 'markdown-escape';
import { default as quiver_configs } from './configs/quiver';
import render from 'utils/canvas_renderer';

export const AppContext = createContext();

export class Themes {
    static values = {
        light: 'light',
        dark: 'dark',
    }

    constructor(updater) {
        this.updater = updater;
        this.theme = Themes.values.dark;
    }

    toggleTheme = () => {
        let vals = Themes.values;

        this.theme = this.theme == vals.dark ? vals.light : vals.dark

        this.updater({ theme: this.theme });
    }
}


class ShortcutItem {
    constructor(config) {
        let { category, label, cmd } = config;

        Object.assign(this, { category, label, cmd, image_data: null })
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


export class Items {
    constructor(updater) {
        this.updater = updater;
        this.items = quiver_configs.map(i => new ShortcutItem(i));
        this.show_markdown = false;
        this.markdown_val = null;

        this.show_image_modal = false;
        this.image_data = null
    }

    static async get_all_images(all_items, progress_cb = () => {}) {
        return new Promise(async (resolve) => {
            for (let item of all_items) {
                var o = await item.fetch_image_data();
                progress_cb(Math.floor(all_items.indexOf(item) / all_items.length * 100));
            }
            resolve();
        });
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

        Items.get_all_images(this.items, progress)
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


class Store extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            theme: new Themes(this.root_updater.bind(this, 'theme')),
            items: new Items(this.root_updater.bind(this, 'items'))
        };
    }

    root_updater = (domain, data) => {
        let newState = {
            ...this.state, [domain]: { ...this.state[domain], ...data }
        }

        this.setState(newState);
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default Store;
