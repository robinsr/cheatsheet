import './SearchBox.scss';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from 'store';

import SearchResult from './SearchResult';

const SearchBox = observer(({
    isMenuOpen=false
}) => {
    let { edit, apps, cursor, setCursor } = useMst();

    let searchRef = useRef();

    let [ query, setQuery ] = useState('')
    let [ focusClass, setFocusClass ] = useState('');
    let [ result, setResult ] = useState([]);

    useEffect(() => {
        if (cursor === 'SEARCH') {
            searchRef.current.focus();
        }
    }, [ cursor ])

    useEffect(function clearOnMenuOpen() {
        if (isMenuOpen) {
            setQuery('');
            setResult([]);
        }
    }, [ isMenuOpen ]);

    function onFocus(e) {
        setFocusClass('is-focused');
    }

    function onBlur(e) {
        setFocusClass('');
    }

    function reset() {
        setQuery('');
        setResult([]);
    }

    function escape(e) {
        if (e.key === "Escape") {
            searchRef.current.blur();
            reset();
        }
    }

    function onSearch(e) {
        setQuery(e.target.value)
        let results = apps.query(e.target.value);
        setResult(results);
    }

    function onItemClick(result) {
        setQuery('');
        setResult([]);
        // TODO, this should just change the cursor, not edit the item
        // edit.setEditItem(result.id);
        apps.setActiveApp(result.app.id);
        setCursor(result.id)
    }

    return (
        <div className="form-autocomplete search-box mx-2">
            <div className={'form-autocomplete-input form-input ' + focusClass}>
                <input className="form-input" id="app-search-input"
                    type="text"
                    placeholder="Search Shortcuts"
                    onChange={onSearch}
                    onFocus={onFocus}
                    onKeyUp={escape}
                    onBlur={onBlur}
                    value={query}
                    ref={searchRef}
                />
            </div>
            {result.length > 0 ?
                <ul className="menu">
                    {result.map(r => (
                        <SearchResult key={'search_' + r.id}
                                         result={r}
                                         query={query}
                                         onClick={onItemClick}
                        />))}
                </ul>
            : null}
        </div>
    );
});

export default SearchBox;
