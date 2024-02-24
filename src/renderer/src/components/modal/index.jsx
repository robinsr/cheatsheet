import React from 'react';

import ImageModal from './ImageModal';
import EditItemModal from './EditItemModal';
import EditAppModal from './EditAppModal';
import HelpModal from './HelpModal';
import UnknownAppModal from './UnknownAppModal'
import UserPrompt from './UserPrompt';
import IgnoreListModal from './IgnoreListModal';

const Modals = () => {
    return (
        <React.Fragment>
            <ImageModal/>
            <EditItemModal/>
            <EditAppModal/>
            <HelpModal/>
            <UnknownAppModal/>
            <IgnoreListModal/>
            <UserPrompt/>
        </React.Fragment>
    )
};

export default Modals;
