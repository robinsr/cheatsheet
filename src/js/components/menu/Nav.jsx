import React from 'react';
import { Navbar, Button } from 'spectre-react';
import OptionsForm from './OptionsForm';
import SearchBox from './SearchBox'


export default function Nav() {

    return (
        <header className="navbar my-2">
            <section className="navbar-section">
                <OptionsForm />
                <SearchBox />
            </section>
        </header>
    );
}
