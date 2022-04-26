import React, { useState, useEffect } from 'react';

import { Provider, rootStore } from 'context/Store.jsx'

import { Footer, ErrorAlert, AppGroups, SidePane } from 'components/layout';
import { ExportModal, ImageModal, EditItemModal } from 'components/modal/'
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

    window.keymap_api.handleStateChange((e, value) => {
        console.log(value)
    })

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
            
        </Provider>
    );
}
