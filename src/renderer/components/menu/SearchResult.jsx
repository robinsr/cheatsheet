import React from 'react';

import ShortcutKey from 'components/card/ShortcutKey';

const SearchResult = ({ result, query, onClick }) => {
    let r = result;

    return (
        <li className="search-box-result menu-item" key={r.id}>
            <a onClick={e => onClick(r)}>
                <div className="tile tile-centered">
                    <div className="tile-icon">
                        <figure className="avatar avatar-sm" data-initial={r.app.name[0].toUpperCase()} />
                    </div>
                    <div className="search-box-result-content tile-content">
                        <div className="search-box-result-content-meta mx-2" >
                            <small><em>{r.app.name}/{r.category.name}</em></small><br />
                        </div>
                        <div className="search-box-result-content-label mx-2">
                            {r.getResultsSplit(query).map((partial, i) => {
                                return i === 1 ?
                                    <mark key={r.id + 'query' + i}>{partial}</mark> :
                                    <span key={r.id + 'query' + i}>{partial}</span>
                            })}
                        </div>
                        <div className="search-box-result-content-shortcut mx-2">
                            <ShortcutKey item={r} command={r.command} />
                        </div>
                    </div>
                </div>
            </a>
        </li>
    )
};

export default SearchResult;