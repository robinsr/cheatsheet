import './App.scss';

import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { ImShrink2 } from 'react-icons/im';
import { Provider, rootStore, useMst } from 'store'
import styled, { ThemeProvider } from 'styled-components';
import { AppGroups, SidePane } from './layout';
import { Nav } from './layout';
import { EditAppModal, EditItemModal, HelpModal, ImageModal, UnknownAppModal } from './modal'
import { AppFlexContainer, columnBreakpoints, FloatingButton, GlobalStyle, themes } from 'components/theme';
import KeyActions from './providers/KeyActions.jsx';


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
    const { ui } = useMst();
    const [ isMenuOpen, setMenuOpen ] = useState(false);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    const resizeToDefault = () => {
        window.cheatsheetAPI.emit('app:requestResize');
    }

    return (
        <ThemeProvider theme={themes[ui.theme]}>
            <React.Fragment>
                <KeyActions>
                    <div id={'blur-target'}>
                        <Nav onMenuClick={toggleMenu} isMenuOpen={isMenuOpen}/>
                        <AppFlexContainer>
                            <SpacedContainer space={headerHeight}>
                                <div className="container grid-xl">
                                    <AppGroups/>
                                </div>
                            </SpacedContainer>
                            <SidePane isOpen={isMenuOpen} onClose={() => setMenuOpen(false)}/>
                        </AppFlexContainer>
                        <FloatingButton onClick={resizeToDefault}>
                            <ImShrink2/>
                        </FloatingButton>
                    </div>
                    <ImageModal/>
                    <EditItemModal/>
                    <EditAppModal/>
                    <HelpModal/>
                    <UnknownAppModal/>
                </KeyActions>
                <GlobalStyle/>
            </React.Fragment>
        </ThemeProvider>
    );
});


// TODO; figure out error boundary. Not possible in function component
export default function App() {
    window.setTheme = rootStore.ui.setTheme;

    return (
        <Provider value={rootStore}>
            <ThemedApp/>
        </Provider>
    );
}

/*
TODO: put these back
<ErrorAlert error={error} onClear={clearError}>
</ErrorAlert>
...
<ExportModal/>
 */