import React, { Component, createContext } from 'react';

import ShortcutCollection from './items/ShortcutCollection';

const ls = window.localStorage;

console.log(window)

console.log(ls.getItem("TEST"))

// ls.setItem("TEST", JSON.stringify({ does_it_work: 'yes' }));


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




class Store extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            theme: new Themes(this.root_updater.bind(this, 'theme')),
            items: new ShortcutCollection(this.root_updater.bind(this, 'items'))
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
