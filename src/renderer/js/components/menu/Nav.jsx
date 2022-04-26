import React from 'react';
import { Navbar, Button } from 'spectre-react';
import OptionsForm from './OptionsForm.jsx';
import SearchBox from './SearchBox.jsx'


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
