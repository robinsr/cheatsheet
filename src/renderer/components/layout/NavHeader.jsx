import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import styled from 'styled-components';
import { SearchBox } from 'components/layout/menu';
import { Button } from 'components/inputs';
import { FlexGrow, SpaceBetweenItem, Transition } from 'components/theme';

const debug = window.cheatsheetAPI.config.get('debug');
const appName = window.cheatsheetAPI.config.get('name');

const ThemedHeader = styled.header`
  ${Transition()};
  
  background-color: ${props => props.theme.menus.bg};
  position: fixed;
  width: 100%;
  margin: 0;
  padding: 0px 4px 8px 13px;
  z-index: 400;
`;

const WindowTitleBar = styled.div`
  width: 100%;
  height: 38px;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  text-align: center;
`;

const NavBarContents = styled.section`
  ${SpaceBetweenItem()}
`;

const SearchBarContainer = styled.div`
  ${FlexGrow()}
`;

const NavHeader = observer(({
    onMenuClick, isMenuOpen=false
}) => {

    let { cursor, state } = useMst();

    let { keyScope, activeWindow } = state;

    return (
        <ThemedHeader>
            <WindowTitleBar>
                {debug
                    ? <small className={"float-right"}>keyScope: {keyScope}; cursor: {cursor}; active: {activeWindow || 'none'}</small>
                    : <p>{appName}</p>
                }
            </WindowTitleBar>
            <div className="navbar">
                <NavBarContents className="navbar-section">
                    <Button primary icon={isMenuOpen ? 'cross' : 'menu'} tabIndex={-1} onClick={onMenuClick}/>
                    <SearchBarContainer>
                        <SearchBox isMenuOpen={isMenuOpen} />
                    </SearchBarContainer>
                </NavBarContents>
            </div>
        </ThemedHeader>
    );
})

export default NavHeader;
