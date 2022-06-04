import { observer } from 'mobx-react-lite';
import { noop } from 'lodash';
import React, { useEffect, useRef } from 'react';
import useLocation from '../../hooks/useLocation';
import useHistory from '../../hooks/useHistory';
import { isMatch } from 'matcher';


const FocusLink = observer(({ path, cursor, useReplace=false, disabled=false, afterClick=noop, children, ...rest }) => {
    let ref = useRef();
    let { hash } = useLocation();
    let { push, replace } = useHistory();

    const clickLink = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (disabled) return;

        useReplace ? replace(path) : push(path);
        afterClick();
    }

    useEffect(() => {
        isMatch(hash, cursor)  && ref.current?.focus();
    }, [ hash ]);

    return (
        <a href={path} ref={ref} onClick={clickLink} tabIndex={-1} {...rest}>{children}</a>
    )
});

export default FocusLink;
