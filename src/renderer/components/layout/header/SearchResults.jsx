import { getPath } from 'mobx-state-tree';
import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import styled from 'styled-components';
import { FocusLink } from 'components/cursor';
import { FlexItem, FlexRow } from 'components/theme';
import ShortcutKey from 'components/card/ShortcutKey.jsx';
import { useMst } from 'store';
import useLocation from 'hooks/useLocation';

const ResultLink = styled.a`
    a:focus, .active {
        color: ${p => p.theme.cursor.color};
        background: ${p => p.theme.cursor.bg};
    }
`;

const ResultList = styled.ul`
    background: ${props => props.theme.base.bg};
`;

const ResultText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-Space: nowrap;
`;

const MetaResult = styled(ResultText)`
  width: 90px;
`;

const ResultLabel = ({ result: { label, id }, query }) => {
    const getResultsSplit = (() => {
        let split = label.substring(0, 25).split(new RegExp('(' + query + ')', 'i'));

        if (split.length > 1) {
            return [split[0], split[1], split.slice(2).join('')]
        } else {
            return [];
        }
    })();

    return (
        <React.Fragment>
            {getResultsSplit.map((partial, i) => {
                return i === 1 ?
                    <mark key={id + 'query' + i}>{partial}</mark> :
                    <span key={id + 'query' + i}>{partial}</span>
            })}
        </React.Fragment>
    )
}

const ResultItem = observer(({ result, query }) => {
    let { path, app, category, command } = result;

    let { search, state } = useMst();
    let { hash } = useLocation();

    const isActive = hash === '#search' + path;

    const cns = classnames('search-result', { 'active': isActive });

    let linkpath = getPath(app);
    let link = '#' + linkpath + '#' + path;

    const onClick = (e) => {
        search.clearQuery();
        state.setKeyScope('APP');
    }

    return (
        <FocusLink path={link} cursor={'#search' + path} afterClick={onClick} className={cns}>
            <FlexRow gap={'0.5rem'}>
                <FlexItem>
                    <figure className="avatar avatar-sm" data-initial={app.name[0].toUpperCase()} />
                </FlexItem>
                <MetaResult as={FlexItem}>
                    <small><em>{app.name}/{category.name}</em></small><br />
                </MetaResult>
                <FlexItem grow>
                    <ResultText>
                        <ResultLabel result={result} query={query}/>
                    </ResultText>
                </FlexItem>
                <FlexItem>
                    <ShortcutKey item={result} command={command} />
                </FlexItem>
            </FlexRow>
        </FocusLink>
    );
})

const SearchResults = observer(({ results, query }) => {
    if (results.length <= 0) {
        return null
    }

    return (
        <ResultList className="menu">
            {results.map(result => (
                <li className="search-box-result menu-item" key={result.id}>
                    <ResultItem result={result} query={query}/>
                </li>
            ))}
        </ResultList>
    )
});

export default SearchResults;

// <KeyScope scope={'SEARCH'} prevScope={'APP'}>
// </KeyScope>
