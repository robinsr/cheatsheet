import React, { useState, useEffect } from 'react';

import { Provider, rootStore } from 'context/Store.jsx'

import { BottomDrawer, ErrorAlert, AppGroups, SidePane } from 'components/layout/index';
import { ExportModal, ImageModal, EditItemModal, EditAppModal } from 'components/modal/index'
import Nav from 'components/menu/Nav.jsx'


// TODO; figure out error boundary. Not possible in function componant
export default function App() {

    const [ error, setError ] = useState(null);
    const [ isMenuOpen, setMenuOpen ] = useState(false);

    const hasError = useEffect(err => {
        return err != null;
    }, [ error ]);

    const clearError = () => {
        setError(null);
    }

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    }

    return (
        <Provider value={rootStore}>
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
            {/*<BottomDrawer/>*/}
        </Provider>
    );
}
