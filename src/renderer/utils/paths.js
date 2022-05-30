import UrlPattern from 'url-pattern';
import { isNull } from 'lodash';
import { getLogger } from './logger';

const log = getLogger('PathPattern', 'DEBUG');

class Pattern extends UrlPattern {
    constructor(pattern, replace) {
        super(pattern);
        this._pattern = pattern;
        this.replacer = replace;
        log.debug('Pattern initialized:', this);
    }

    match(url) {
        let testUrl = url.replace(this.replacer, '');
        let result = super.match(testUrl);

        return [ !isNull(result), result || {} ];
    }

    link(args = { _: '' }) {
        try {
            return super.stringify(args);
        } catch (e) {
            log.error('Could not generate link. Args:', args);
        }
    }

    matcher(args = { _: '' }) {
        let newPattern = this.pattern.stringify(args);
        return new Pattern(newPattern, this.replacer);
    }

    extend(pattern) {
        let newPattern = [ this._pattern, pattern].join('');
        return new Pattern(newPattern, this.replacer);
    }
}

class PathPattern extends Pattern {
    constructor(pattern) {
        super(pattern, /#.*$/);
    }
}

class HashPattern extends Pattern {
    constructor(pattern) {
        super(pattern, /^[^#]*/);
    }
}


// Home, page functions
export const HOME = new PathPattern('/');
export const SIDEBAR = new HashPattern('#sidebar(*)');
export const SEARCH = new HashPattern('#search(*)')

// Apps, Shortcuts
export const APP = new PathPattern('/apps/appList/:appIndex');
export const EDIT_APP = APP.extend('/edit');
export const ITEM = new HashPattern('#/apps/appList/:appIndex/categories/:categoryIndex/items/:itemIndex');
export const EDIT_ITEM = ITEM.extend('/edit(/field=:field)');


// Modals and menus
export const HELP = new HashPattern('#modal/help');
export const IGNORE_APPS = new HashPattern('#modal/ignore-apps');
