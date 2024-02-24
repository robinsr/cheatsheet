import './SearchBox.scss';

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import ShortcutItem from 'store/app/ShortcutItem';
import styled from 'styled-components';
import { useMst } from 'store';
import { isEnterKey } from 'utils';
import { APP, SEARCH } from 'utils/paths';

import { Transition } from 'components/theme';
import { CursorFocusableInput } from 'components/inputs';
import useHistory from '../../../hooks/useHistory';
import useParams from '../../../hooks/useParams';
import SearchResults from './SearchResults';

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
    let { next } = useHistory();
    let { apps, search } = useMst();
    let { query, results, updateQuery, clearQuery } = search;

    let [ focused, isFocused ] = useState(false);
    let isFocusedClass = classnames({ 'is-focused': focused === true });

    let currentApp = null;
    let [ isAppPage, params ] = useParams(APP);
    if (isAppPage) {
        currentApp = apps.at(params.appIndex).name;
    }

    useEffect(() => {
        if (isMenuOpen) {
            clearQuery();
        }
    }, [ isMenuOpen ]);

    const handleKeyPress = (e) => {
        if (!isEnterKey(e) || query.length < 6) {
            e.stopPropagation();
            return;
        }

        let app = apps.selectedApp;
        let category = app.categories[0];

        if (!category) {
            category = app.addCategory();
        }

        let newItem = category.addItem(query);

        clearQuery();
        next(newItem.path + '/edit/field=label');
    }

    return (
        <FormAutoComplete>
            <FormAutoCompleteInput className={isFocusedClass}>
                <CursorFocusableInput
                    pattern={SEARCH}
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
                    <small className="float-right"><em>↩ to create new in {currentApp}</em></small>
                }
            </FormAutoCompleteInput>
            <SearchResults results={results} query={query}/>
        </FormAutoComplete>
    );
});

export default SearchBox;
