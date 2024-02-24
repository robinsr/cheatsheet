import './components/App.scss';

import { createRoot } from 'react-dom/client';
import React from 'react';
import { getLogger } from './utils';
import App from './components/App.jsx';

const log = getLogger('AppMain');


log.info('Starting app with config:');
log.info(JSON.stringify(window.cheatsheetAPI.config.getAll(), null, 1));


const root = createRoot(document.getElementById('app'));
root.render(<App />);
