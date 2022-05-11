import makeButtonThemes from 'components/theme/buttons';
import { darken, lighten, transparentize } from 'polished';

export const columnBreakpoints = {
    1: '768px',
    2: '1248px'
};

const W = '#FFF';

const BW = {
    100: darken(.02, W),
    200: darken(.08, W),
    300: darken(.14, W),
    400: darken(.25, W),
    500: darken(.50, W),
    600: darken(.75, W),
    700: darken(.82, W),
    800: darken(.90, W),
    900: darken(.97, W)
}

const accents = {
    night: '#5755d9',
    day: '#2e5bec'
}

const themes = {
    night: {
        buttons: makeButtonThemes(accents.night),
        base: {
            bg: BW[900],
            text: BW[300]
        },
        menus: {
            bg: BW[700],
            text: BW[300]
        },
        card: {
            body: BW[700],
            head: BW[800],
            text: BW[300],
            border: BW[400]
        },
        keys: {
            bg: BW[800],
            text: BW[300]
        },
        cursor: {
            color: accents.night,
            bg: transparentize(.78, BW[900])
        },
        inputs: {
            bg: BW[600]
        },
        capture: {
            bg: darken(0.1, BW[500])
        },
        blur: transparentize(0.55, BW[900]),
        accent: accents.night,
        /** @deprecated **/
        accentColor: accents.night,
        /** @deprecated **/
        background: BW[400],
        /** @deprecated **/
        textBase: BW[100],
        /** @deprecated **/
        border: '0.05rem solid #686868',

    },
    day: {
        buttons: makeButtonThemes(accents.day),
        base: {
            bg: BW[100],
            text: BW[600]
        },
        menus: {
            bg: BW[100],
            text: BW[600]
        },
        card: {
            body: BW[100],
            head: BW[200],
            text: BW[600],
            border: BW[500]
        },
        keys: {
            bg: BW[500],
            text: BW[700]
        },
        cursor: {
            color: accents.day,
            bg: transparentize(.84, accents.day)
        },
        inputs: {
            bg: BW[400]
        },
        capture: {
            bg: lighten(0.1, BW[400])
        },
        blur: transparentize(0.75, BW[100]),
        accent: accents.day,
        accentColor: accents.day,
        background: '#f7f8f9',
        textBase: '#000',
        border: '0.05rem solid #dadee4',
    }
}

export default themes;
