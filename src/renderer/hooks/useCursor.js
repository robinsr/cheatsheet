import { useMst } from 'store'
import { isMatch } from 'matcher';
import UrlPattern from 'url-pattern';
import { getLogger } from 'utils';


const log = getLogger('useCursor', 'DEBUG');

/**
 * Uses the hash of location
 * @param {string|UrlPattern} pattern
 */
const useCursor = (pattern='*') => {
    const { hash, } = useMst().history;
    let matches = false;
    let params = null;

    // Support UrlMatcher objects (not string.match)
    if (pattern instanceof UrlPattern) {
        [ matches, params ] = pattern.match && pattern.match(hash);
        log.debug(pattern, hash, matches, params);
    } else {
        // plain string
        matches = isMatch(hash, pattern);
    }

    return { matches, params };
}

export default useCursor;