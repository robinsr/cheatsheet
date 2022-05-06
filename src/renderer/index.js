import './components/App.scss';

import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './components/App.jsx';

const root = createRoot(document.getElementById('app'));
 
root.render(<App />);

window.cheatsheetAPI.config()
    .then(config => console.log(config));

window.addEventListener('hashchange', event => {
    console.log(`Hash Change:`, event.path[0].location.hash);
});
