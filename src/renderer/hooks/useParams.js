import React from 'react';
import { useMst } from 'store';

const useParams = (path) => {
    let { cursor } = useMst().history;
    return path.match(cursor);
}

export default useParams;
