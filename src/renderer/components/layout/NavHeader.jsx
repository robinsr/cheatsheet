import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ImShrink2 } from 'react-icons/im';
import { useMst } from 'store';
import styled, { keyframes } from 'styled-components';
import { SearchBox } from 'components/layout/header';
import { Button } from 'components/inputs';
import { FlexGrow, FlexItem, SpaceBetweenItem, Transition } from 'components/theme';

const debug = window.cheatsheetAPI.config.get('debug');
const appName = window.cheatsheetAPI.config.get('name');

// todo: figure out how to make this smoooth
const bgKeyFrame = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const ThemedHeader = styled.header`
  ${Transition()};
  background: ${props => props.theme.header.bg};
  background-position: ${props => props.theme.header.bgPos};
  background-size: 100% 400%;
  position: fixed;
  width: 100%;
  margin: 0;
  padding: 0 10px 8px 10px;
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

    const resizeToDefault = () => {
        window.cheatsheetAPI.emit('app:requestResize');
    }

    useEffect(() => {

    }, []);

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
                    <FlexItem onClick={resizeToDefault} width={'40'}>
                        <ImShrink2/>
                    </FlexItem>
                </NavBarContents>
            </div>
        </ThemedHeader>
    );
})

export default NavHeader;
