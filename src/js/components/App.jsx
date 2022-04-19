import React from 'react';

import Store from 'context/Store'

import Nav from 'components/Nav.jsx'
import ShortcutCards from 'components/ShortcutCards.jsx';
import Hero from 'components/Hero.jsx';
import ExportModal from 'components/modal/ExportModal.jsx'
import ImageModal from 'components/modal/ImageModal.jsx'
import NewItemModal from 'components/modal/NewItemModal.jsx'



export default class App extends React.Component {
	render() {
		return (
            <Store>
                <Nav />
    			<div className="section section-hero">
                    <div className="grid-hero container grid-lg">
                        <ShortcutCards />
                    </div>
                </div>
                <ExportModal />
                <ImageModal />
                <NewItemModal />
            </Store>
        )
	}
}
