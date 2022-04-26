import './SearchBox.scss';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import * as _ from 'lodash';

import { useMst } from 'context/Store.jsx';

import ShortcutKey from 'components/card/ShortcutKey.jsx';

const SearchBox = observer(({
    isMenuOpen=false
}) => {
    let { items } = useMst();

    let searchRef = useRef();

    let [ query, setQuery ] = useState('')
    let [ focusClass, setFocusClass ] = useState('');
    let [ result, setResult ] = useState([]);

    useEffect(function clearOnMenuOopen() {
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

    function onSearch(e) {
        setQuery(e.target.value)
        let results = items.find(e.target.value);
        setResult(results);
    }

    function onItemClick(id) {
        setQuery('');
        setResult([]);
        items.setEditItem(id);
    }

    window.keymap_api.handleStateChange((e, value) => {
        if (value === 'focus') {
            searchRef.current.focus();
        }

        if (value === 'blur') {
            setQuery('');
            setResult([]);
        }
    })

    return (
        <div className="form-autocomplete search-box mx-2">
            <div className={'form-autocomplete-input form-input ' + focusClass}>
                <input className="form-input"
                    type="text"
                    placeholder="Search Shortcuts"
                    onChange={onSearch}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={query}
                    ref={searchRef}
                />
            </div>
            {result.length > 0 ?
                <ul className="menu">
                    {result.map(r => <SearchBoxResult key={'search_' + r.id} result={r} query={query} onClick={onItemClick} />)}
                </ul>
            : null}
        </div>
    );
});


const SearchBoxResult = ({ result, query, onClick }) => {
    let r = result;

    return (
        <li className="search-box-result menu-item" key={r.id}>
            <a href="#" onClick={e => onClick(r.id)}>
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
}

export default SearchBox;
