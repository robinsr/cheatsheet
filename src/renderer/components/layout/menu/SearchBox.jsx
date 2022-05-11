import './SearchBox.scss';
import classnames from 'classnames';
import { CursorFocusableInput } from 'components/inputs';
import KeyScope from 'components/providers/KeyScope.jsx';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from 'store';
import { isEnterKey, KeyEmitter } from 'utils';
import { macos_symbols } from 'utils/macos_symbols.js';

import SearchResult from './SearchResult.jsx';

const SearchBox = observer(({
    isMenuOpen=false
}) => {
    let { apps, cursor, setCursor, search, edit } = useMst();
    let { query, results, updateQuery, clearQuery } = search;

    let [ focused, isFocused ] = useState(false);

    let cns = classnames('form-autocomplete-input form-input', {
        'is-focused': focused === true
    })

    useEffect(function clearOnMenuOpen() {
        if (isMenuOpen) {
            clearQuery();
        }
    }, [ isMenuOpen ]);

    const handleKeyPress = (e) => {
        if (isEnterKey(e) && query.length > 5) {
            onNewKeyClick()
        }
    }

    const onNewKeyClick = (e) => {
        let app = apps.selectedApp;
        let cat = app.categories[0];
        let id = cat.addItem(query);
        edit.setEditItem(id);
        clearQuery();
        setCursor('edit-form-label');
    }

    return (
        <div className="form-autocomplete search-box mx-2">
            <div className={cns}>
                <CursorFocusableInput
                    cursorName={'SEARCH'}
                    blur={true}
                    className="form-input"
                    id="app-search-input"
                    type="text"
                    placeholder="Search Shortcuts or add new"
                    onChange={e => updateQuery(e.target.value)}
                    onFocus={() => isFocused(true)}
                    onBlur={() => isFocused(false)}
                    onKeyPress={handleKeyPress}
                    value={search.query}
                />
                {query.length > 5 &&
                    <small className="float-right"><em>{macos_symbols.return.symbol} to create new</em></small>
                }
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
