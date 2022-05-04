import './SearchResult.scss';

import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';

import ShortcutKey from 'components/card/ShortcutKey';
import { useMst } from 'store';

const SearchResult = observer(({ result, query }) => {
    let { id, label, app, category, command } = result;

    let { cursor, setCursor, search, apps } = useMst();

    const cns = classnames({
        'active': cursor === 'search_' + id
    })

    const onClick = (e) => {
        search.clearQuery();
        apps.setActiveApp(result.app.id);
        setCursor(result.id)
    }

    const getResultsSplit = (() => {
        let split = label.split(new RegExp('(' + query + ')', 'i'));

        if (split.length > 1) {
            return [split[0], split[1], split.slice(2).join('')]
        } else {
            return [];
        }
    })();

    return (
        <li className="search-box-result menu-item" key={id}>
            <a onClick={onClick} className={cns}>
                <div className="tile tile-centered">
                    <div className="tile-icon">
                        <figure className="avatar avatar-sm" data-initial={app.name[0].toUpperCase()} />
                    </div>
                    <div className="search-box-result-content tile-content">
                        <div className="search-box-result-content-meta mx-2" >
                            <small><em>{app.name}/{category.name}</em></small><br />
                        </div>
                        <div className="search-box-result-content-label mx-2">
                            {getResultsSplit.map((partial, i) => {
                                return i === 1 ?
                                    <mark key={id + 'query' + i}>{partial}</mark> :
                                    <span key={id + 'query' + i}>{partial}</span>
                            })}
                        </div>
                        <div className="search-box-result-content-shortcut mx-2">
                            <ShortcutKey item={result} command={command} />
                        </div>
                    </div>
                </div>
            </a>
        </li>
    )
});

export default SearchResult;