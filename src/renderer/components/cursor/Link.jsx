import PropTypes from 'prop-types';
import React, { isValidElement } from 'react';
import { observer } from 'mobx-react-lite';
import { noop } from 'lodash';
import useHistory from 'hooks/useHistory';

const Link = observer(({ path, useReplace=false, disabled=false, afterClick=noop, children }) => {
    let { push, replace } = useHistory();

    const clickLink = (e, path) => {
        e.preventDefault();
        e.stopPropagation();

        if (disabled) return;

        useReplace ? replace(path) : push(path);
        afterClick();
    }

    if (isValidElement(children)) {
        return <span data-href={path} onClick={e => clickLink(e, path)}>{children}</span>;
    } else {
        return <p data-href={path} onClick={e => clickLink(e, path)}>{children}</p>;
    }

});

Link.propTypes = {
    path: PropTypes.string.isRequired,
    useReplace: PropTypes.bool,
    disabled: PropTypes.bool,
    afterClick: PropTypes.func
};

export default Link;
