import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ImShrink2 } from 'react-icons/im';
import { useMst } from 'store';
import styled, { keyframes } from 'styled-components';
import { SearchBox } from 'components/layout/header';
import { Button } from 'components/inputs';
import { FlexGrow, FlexItem, FlexRow, SpaceBetweenItem, Transition } from 'components/theme';
import { HOME, SIDEBAR } from 'utils/paths';
import useHistory from '../../hooks/useHistory';
import useParams from '../../hooks/useParams';

const appName = window.cheatsheetAPI.config.get('name');
const debug = window.cheatsheetAPI.config.get('debug');


const NavHeader = observer(() => {
    const { cursor, state } = useMst();
    const { push, back } = useHistory();
    const [ isOpen ] = useParams(SIDEBAR);

    const onMenuClick = e => {
        e.preventDefault(); // prevent button focus
        isOpen ? back() : push(SIDEBAR.link());
    }

    return (
        <ThemedHeader>
            <WindowTitleBar>
                {titleBarContent(cursor, state.keyScope)}
            </WindowTitleBar>
            <div className="navbar">
                <NavBarContents className="navbar-section">
                    <Button primary icon={isOpen ? 'cross' : 'menu'} tabIndex={-1} onClick={onMenuClick}/>
                    <SearchBarContainer>
                        <SearchBox isMenuOpen={isOpen} />
                    </SearchBarContainer>
                    <FlexItem onClick={resizeToDefault} width={'40'}>
                        <ImShrink2/>
                    </FlexItem>
                </NavBarContents>
            </div>
        </ThemedHeader>
    );
});

const resizeToDefault = () => {
    window.cheatsheetAPI.emit('app:requestResize');
}

const titleBarContent = (cursor, keyScope) => {
    if (!debug) {
        return <p>{appName}</p>;
    }

    return (
        <FlexRow>
            <FlexItem style={{paddingLeft: '70px'}}>{keyScope}</FlexItem>
            <FlexItem>{cursor}</FlexItem>
        </FlexRow>
    );
}

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


export default NavHeader;
