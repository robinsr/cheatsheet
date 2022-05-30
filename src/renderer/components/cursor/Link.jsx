import React, { isValidElement } from 'react';
import { observer } from 'mobx-react-lite';
import { noop } from 'lodash';
import useHistory from '../../hooks/useHistory';

const Link = observer(({ path, useReplace=false, afterClick=noop, children }) => {
    let { push, replace } = useHistory();

    const clickLink = (e, path) => {
        e.preventDefault();
        useReplace ? replace(path) : push(path);
        afterClick();
    }

    if (isValidElement(children)) {
        return <span data-href={path} onClick={e => clickLink(e, path)}>{children}</span>;
    } else {
        return <p data-href={path} onClick={e => clickLink(e, path)}>{children}</p>;
    }

});

export default Link;
