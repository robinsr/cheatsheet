import './Nav.scss';

import React from 'react';
import SearchBox from './SearchBox.jsx';
import {observer} from 'mobx-react-lite';
import {useMst} from 'store';



const Nav = observer(({
    onMenuClick, isMenuOpen=false
}) => {

    let { cursor, state } = useMst();

    let { keyScope, activeWindow } = state;

    return (
        <header id="main-header">
            <div id="title-bar">
                <small className={"float-right"}>keyScope: {keyScope}; cursor: {cursor}; active: {activeWindow || 'none'}</small>
            </div>
            <div className="navbar">
                <section className="navbar-section">
                    <button className={'btn btn-primary'} tabIndex={-1} onClick={onMenuClick}>
                        <i className={'icon icon-' + (isMenuOpen ? 'cross' : 'menu')}></i>
                    </button>
                    <SearchBox isMenuOpen={isMenuOpen} />
                </section>
            </div>
        </header>
    );
})

export default Nav;
