import './Nav.scss';

import React from 'react';
import { Navbar, Button } from 'spectre-react';
import OptionsForm from './OptionsForm.jsx';
import SearchBox from './SearchBox.jsx';



export default function Nav({
    onMenuClick, isMenuOpen=false
}) {



    return (
        <header id="main-header">
            <div id="title-bar"></div>
            <div className="navbar">
                <section className="navbar-section">
                    <Button  primary={true} onClick={onMenuClick}>
                        <i className={'icon icon-' + (isMenuOpen ? 'cross' : 'menu')}></i>
                    </Button>
                    <SearchBox isMenuOpen={isMenuOpen} />
                </section>
            </div>
        </header>
    );
}
