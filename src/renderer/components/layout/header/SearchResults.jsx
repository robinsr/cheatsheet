import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import styled from 'styled-components';

import { FlexItem, FlexRow } from 'components/theme';
import KeyScope from 'components/providers/KeyScope.jsx';
import ShortcutKey from 'components/card/ShortcutKey.jsx';
import { useMst } from 'store';

const ResultList = styled.ul`
    background: ${props => props.theme.base.bg};
`

const ResultText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-Space: nowrap;
`;

const MetaResult = styled(ResultText)`
  width: 90px;
`

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

const ResultLink = observer(({ result, query }) => {
    let { id, label, app, category, command, link } = result;

    let { cursor, setCursor, search, apps } = useMst();

    const cns = classnames({ 'active': cursor === 'search_' + id })

    const onClick = (e) => {
        search.clearQuery();
        apps.setActiveApp(result.app.id);
        setCursor(result.id)
    }

    return (
        <a href={'#' + link} onClick={onClick} className={cns} >
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
        </a>
    );
})

const SearchResults = observer(({ results, query }) => {
    if (results.length <= 0) {
        return null
    }

    return (
        <KeyScope scope={'SEARCH'} prevScope={'APP'}>
            <ResultList className="menu">
                {results.map(result => (
                    <li className="search-box-result menu-item" key={result.id}>
                        <ResultLink result={result} query={query}/>
                    </li>
                ))}
            </ResultList>
        </KeyScope>
    )
});

export default SearchResults;