import React from 'react';

import Store from 'context/Store'

import Nav from 'components/Nav.jsx'
import ShortcutCards from 'components/ShortcutCards.jsx';
import Hero from 'components/Hero.jsx';
import Footer from 'components/Footer.jsx';
import ExportModal from 'components/modal/ExportModal.jsx'
import ImageModal from 'components/modal/ImageModal.jsx'
import NewItemModal from 'components/modal/NewItemModal.jsx'
import ErrorAlert from 'components/ErrorAlert.jsx';



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
