import './SearchBox.scss';
import KeyScope from 'components/providers/KeyScope';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from 'store';

import SearchResult from './SearchResult';

const SearchBox = observer(({
    isMenuOpen=false
}) => {
    let { search, cursor } = useMst();
    let { query, results, updateQuery, clearQuery } = search

    let searchRef = useRef();

    let [ focusClass, setFocusClass ] = useState('');

    useEffect(() => {
        if (cursor === 'SEARCH') {
            searchRef.current.focus();
        }
    }, [ cursor ])

    useEffect(function clearOnMenuOpen() {
        if (isMenuOpen) {
            clearQuery();
        }
    }, [ isMenuOpen ]);


    return (
        <div className="form-autocomplete search-box mx-2">
            <div className={'form-autocomplete-input form-input ' + focusClass}>
                <input className="form-input" id="app-search-input"
                    type="text"
                    placeholder="Search Shortcuts"
                    onChange={e => updateQuery(e.target.value)}
                    onFocus={() => setFocusClass('is-focused')}
                    onBlur={() => setFocusClass('')}
                    value={search.query}
                    ref={searchRef}
                />
            </div>
            {results.length > 0 &&
                <KeyScope scope={'SEARCH'} prevScope={'APP'}>
                    <ul className="menu">
                        {results.map(r => <SearchResult key={'search_' + r.id} result={r} query={query}/>)}
                    </ul>
                </KeyScope>
            }
        </div>
    );
});

export default SearchBox;
