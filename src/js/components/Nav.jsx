import React, { Component } from 'react';
import { Navbar, Button } from 'spectre-react';
import OptionsForm from 'components/OptionsForm.jsx';



export default class Nav extends Component {

    render() {
        return (
            <header className="navbar">
                <section className="navbar-section">
                    <div className="navbar-brand mr-2">
                        <a href="..." className="h5">Keymap Maker</a>
                        <br />
                        <small>Generate keyboard shortcut sheets</small>
                    </div>
                </section>
                <section className="navbar-section">
                    <div className="float-right">
                        <div className="d-inline mx-2">
                            <a href="..." className="btn btn-link">GitHub</a>
                        </div>
                        <OptionsForm />
                    </div>
                </section>
            </header>
        );
    }
}
