import React, { Component } from 'react';
import { Navbar, Button } from 'spectre-react';
import OptionsForm from './OptionsForm.jsx';



export default class Nav extends Component {

    render() {
        return (
            <header className="navbar my-2">
                <section className="navbar-section">
                    <OptionsForm />
                    <div className="input-group input-inline">
                        <input className="form-input" type="text" placeholder="search" />
                        <button className="btn btn-primary input-group-btn">Search</button>
                    </div>
                </section>
            </header>
        );
    }
}
