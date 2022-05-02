import './Nav.scss';

import React from 'react';
import { Button } from 'spectre-react';
import SearchBox from './SearchBox.jsx';
import {observer} from 'mobx-react-lite';
import {useMst} from 'store';



const Nav = observer(({
    onMenuClick, isMenuOpen=false
}) => {

    let { cursor, ui } = useMst();

    return (
        <header id="main-header">
            <div id="title-bar">
                <small className={"float-right"}>cursor: {cursor}; active: {ui.activeWindow || 'none'}</small>
            </div>
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
})

export default Nav;
