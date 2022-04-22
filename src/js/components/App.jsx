import React, { useState, useEffect } from 'react';

import { Provider, rootStore } from 'context/Store'

import { Footer, ErrorAlert } from 'components/layout';
import { ExportModal, ImageModal, NewItemModal } from 'components/modal/'

import Nav from 'components/menu/Nav.jsx'
import ShortcutCards from 'components/card/ShortcutCards.jsx';


// TODO; figure out error boundary. Not possible in function componant
export default function App() {

    const [ error, setError ] = useState(null);

    const hasError = useEffect(err => {
        return err != null;
    }, [ error ]);

    const clearError = () => {
        setError(null);
    }

    return (
        <Provider value={rootStore}>
            <div className="app-container">
                <div className="app-content">
                    <Nav/>
                    <div className="container grid-lg">
                        <ErrorAlert error={error} onClear={clearError}>
                            <ShortcutCards/>
                        </ErrorAlert>
                    </div>
                </div>
                <div className="divider"></div>
                <Footer/>
            </div>
            {/*<ExportModal/>*/}
            <ImageModal/>
            {/*<NewItemModal/>*/}
        </Provider>
    );
}
