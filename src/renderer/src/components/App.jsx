import './App.scss';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Provider, rootStore, useMst } from '../store/index.js'
import styled, { ThemeProvider } from 'styled-components';
import { AppGroups, SidePane, Nav } from './layout';
import ErrorAlert from 'components/layout/ErrorAlert.jsx';
import Modals from './modal'
import { AppFlexContainer, columnBreakpoints, GlobalStyle, themes } from 'components/theme/index.js';
import KeyProvider from './providers/KeyProvider';
import { Debugger } from 'components/dev/Debug';
import { ErrorBoundary } from 'react-error-boundary'

const debug = window.cheatsheetAPI.config.get('debug');

// todo; move this somewhere
const headerHeight = '78px';
const SpacedContainer = styled.div`
  margin-top: ${headerHeight};
  padding-top: 3.2rem;
  
  @media (max-width: ${columnBreakpoints[ 2 ]}) {
    padding-top: 1.6rem;
  }
  
  @media (max-width: ${columnBreakpoints[ 1 ]}) {
    padding-top: 0.8rem;
  }
`;

const ThemedApp = observer(() => {
    const { settings, cursor, state } = useMst();
    let { keyScope, activeWindow } = state;

    const [ isMenuOpen, setMenuOpen ] = useState(false);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    return (
        <ThemeProvider theme={themes[settings.theme]}>
            <React.Fragment>
                <KeyProvider>
                    <div id={'blur-target'}>
                        <Nav onMenuClick={toggleMenu} isMenuOpen={isMenuOpen}/>
                        <AppFlexContainer>
                            <SpacedContainer space={headerHeight}>
                                <div className="container grid-xl">
                                    <AppGroups/>
                                </div>
                            </SpacedContainer>
                            <SidePane/>
                        </AppFlexContainer>
                    </div>
                    {debug && <Debugger obj={{ keyScope, activeWindow, cursor }}/>}
                    <Modals/>
                </KeyProvider>
                <GlobalStyle/>
            </React.Fragment>
        </ThemeProvider>
    );
});

const ThemedErrorState = observer((props) => {
    const { settings } = useMst();
    return (
        <ThemeProvider theme={themes[settings.theme]}>
            <AppFlexContainer>
                <SpacedContainer space={headerHeight}>
                    <div className="container grid-xl">
                        <ErrorAlert {...props} />
                    </div>
                </SpacedContainer>
            </AppFlexContainer>
            <GlobalStyle/>
        </ThemeProvider>
    );
});


// TODO; figure out error boundary. Not possible in function component
export default function App() {
    return (
        <Provider value={rootStore}>
            <p>Poop Dick</p>
            <ErrorBoundary
                FallbackComponent={ThemedErrorState}
                onReset={() => {
                    console.log('Resetting...');
                    window.cheatsheetAPI.reload();
                }}>
                    <ThemedApp/>
            </ErrorBoundary>
        </Provider>
    );
}
