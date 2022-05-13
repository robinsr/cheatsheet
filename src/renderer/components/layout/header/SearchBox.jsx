import './SearchBox.scss';
import classnames from 'classnames';
import { CursorFocusableInput } from 'components/inputs';
import { Transition } from 'components/theme';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from 'store';
import styled from 'styled-components';
import { isEnterKey } from 'utils';
import { macos_symbols } from 'utils/macos_symbols.js';

import SearchResults from './SearchResults.jsx';

const StyledFormElement = styled.div`
  ${Transition()};
  background: ${props => props.theme.base.bg};
  
  input {
    ${Transition()};
  }
  
  .form-input {
    border: none; // remove spectre default
  }
`;

const FormAutoComplete = styled(StyledFormElement).attrs(props => ({
    className: [props.className, 'form-autocomplete'].join(' ')
}))`
  max-width: 520px;
  margin: 0 .4rem;
`;

const FormAutoCompleteInput = styled(StyledFormElement).attrs(props => ({
    className: [props.className, 'form-autocomplete-input', 'form-input'].join(' ')
}))``;


const SearchBox = observer(({
    isMenuOpen=false
}) => {
    let { apps, cursor, setCursor, search, edit } = useMst();
    let { query, results, updateQuery, clearQuery } = search;

    let [ focused, isFocused ] = useState(false);

    let isFocusedClass = classnames({ 'is-focused': focused === true });

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
        <FormAutoComplete>
            <FormAutoCompleteInput className={isFocusedClass}>
                <CursorFocusableInput
                    cursorName={'SEARCH'}
                    blur={true}
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
            </FormAutoCompleteInput>
            <SearchResults results={results} query={query}/>
        </FormAutoComplete>
    );
});

export default SearchBox;
