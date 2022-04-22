import React from 'react';

import Store from 'context/Store'

import { Footer, ErrorAlert } from 'components/layout';
import { ExportModal, ImageModal, NewItemModal } from 'components/modal/'

import Nav from 'components/menu/Nav.jsx'
import ShortcutCards from 'components/card/ShortcutCards.jsx';



export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    clearError = () => {
        this.setState({ hasError: false, error: null });
    }

	render() {
		return (
            <Store>
                <div className="app-container">
                    <div className="app-content">
                        <Nav/>
                        <div className="container grid-lg">
                            <ErrorAlert error={this.state.error} onClear={this.clearError}>
                                <ShortcutCards/>
                            </ErrorAlert>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <Footer/>
                </div>
                <ExportModal/>
                <ImageModal/>
                <NewItemModal/>
            </Store>
        )
	}
}
