import './App.scss';

import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Provider, rootStore, useMst } from 'store'
import { BottomDrawer, ErrorAlert, AppGroups, SidePane } from './layout';
import { HelpModal, ImageModal, EditItemModal, EditAppModal } from './modal'
import Nav from './menu/Nav';
import KeyActions from './providers/KeyActions.jsx';
import { columnBreakpoints, themes, GlobalStyle } from 'components/theme';
import styled, { ThemeProvider } from 'styled-components';


const AppFlexContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin: 0 8px;
    user-select: none;
`;

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


    return (
        <ThemeProvider theme={themes[ui.theme]}>
            <React.Fragment>
                <KeyActions>
                    <Nav onMenuClick={toggleMenu} isMenuOpen={isMenuOpen}/>
                    <AppFlexContainer id={'blur-target'}>
                        <SpacedContainer space={headerHeight}>
                            <div className="container grid-xl">
                                <AppGroups/>
                            </div>
                        </SpacedContainer>
                        <SidePane isOpen={isMenuOpen} onClose={() => setMenuOpen(false)}/>
                    </AppFlexContainer>
                    <ImageModal/>
                    <EditItemModal/>
                    <EditAppModal/>
                    <BottomDrawer/>
                    <HelpModal/>
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