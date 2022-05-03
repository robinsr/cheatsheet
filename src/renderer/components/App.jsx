import './App.scss';

import React, { useState } from 'react';
import { Provider, rootStore } from 'store'
import { BottomDrawer, ErrorAlert, AppGroups, SidePane } from './layout';
import { HelpModal, ImageModal, EditItemModal, EditAppModal } from './modal'
import Nav from './menu/Nav';
import KeyActions from './providers/KeyActions.jsx';


// TODO; figure out error boundary. Not possible in function component
export default function App() {

    const [ error, setError ] = useState(null);
    const [ isMenuOpen, setMenuOpen ] = useState(false);

    const clearError = () => {
        setError(null);
    }

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    }

    return (
        <Provider value={rootStore}>
            <KeyActions>
                <Nav onMenuClick={toggleMenu} isMenuOpen={isMenuOpen}/>
                <div className="app-container">
                    <div className="app-content">
                        <div className="container grid-lg">
                            <AppGroups/>
                            <ErrorAlert error={error} onClear={clearError}>
                            </ErrorAlert>

                        </div>
                    </div>
                    <SidePane isOpen={isMenuOpen} onClose={() => setMenuOpen(false)}/>
                </div>
                {/*<ExportModal/>*/}
                <ImageModal/>
                <EditItemModal/>
                <EditAppModal/>
                <BottomDrawer/>
                <HelpModal/>
            </KeyActions>
        </Provider>
    );
}
