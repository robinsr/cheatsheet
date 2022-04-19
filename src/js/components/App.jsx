import React from 'react';

import Store from 'context/Store'
import ShortcutCards from 'components/ShortcutCards.jsx';
import OptionsForm from 'components/OptionsForm.jsx';
import Hero from 'components/Hero.jsx';
import ExportModal from 'components/modal/ExportModal.jsx'
import ImageModal from 'components/modal/ImageModal.jsx'


export default class App extends React.Component {
	render() {
		return (
            <Store>
    			<div className="section section-hero">
                    <div className="grid-hero container grid-lg">
                        <Hero />
                        <OptionsForm />
                        <ShortcutCards />
                    </div>
                </div>
                <ExportModal />
                <ImageModal />
            </Store>
        )
	}
}
