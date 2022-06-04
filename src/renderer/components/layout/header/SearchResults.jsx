import { getPath } from 'mobx-state-tree';
import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import styled from 'styled-components';

import { FlexItem, FlexRow } from 'components/theme';
import KeyScope from 'components/providers/KeyScope.jsx';
import ShortcutKey from 'components/card/ShortcutKey.jsx';
import { useMst } from 'store';
import useHistory from '../../../hooks/useHistory';

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
    let { id, app, category, command } = result;

    let { search } = useMst();
    let { hash } = useHistory();

    const cns = classnames({ 'active': hash === '#search/' + id })

    let linkpath = getPath(app);
    let linkhash = getPath(result);
    let link = '#' + linkpath + '#' + linkhash;

    const onClick = (e) => {
        search.clearQuery();
    }

    return (
        <a href={link} onClick={onClick}  className={cns} onFocus={e => {}}>
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
        <ResultList className="menu">
            {results.map(result => (
                <li className="search-box-result menu-item" key={result.id}>
                    <ResultLink result={result} query={query}/>
                </li>
            ))}
        </ResultList>
    )
});

export default SearchResults;

// <KeyScope scope={'SEARCH'} prevScope={'APP'}>
// </KeyScope>
