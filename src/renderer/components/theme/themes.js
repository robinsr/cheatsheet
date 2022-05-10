import makeButtonThemes from 'components/theme/buttons';
import { darken, lighten, transparentize } from 'polished';

export const columnBreakpoints = {
    1: '768px',
    2: '1248px'
};

const blackLevels = {
    1: lighten(.03, '#000'),
    2: lighten(.10, '#000'),
    3: lighten(.25, '#000'),
    4: darken(.12, '#fff'),
    5: darken(.05, '#fff'),
    6: darken(.02, '#fff')
}

const themeBase = {
    night: '#5755d9',
    day: '#2e5bec'
}

const themes = {
    night: {
        base: {
            bg: blackLevels[1],
            text: blackLevels[4]
        },
        menus: {
            bg: blackLevels[2],
            text: blackLevels[4]
        },
        card: {
            body: blackLevels[3],
            head: blackLevels[2],
            text: blackLevels[4],
            border: darken(0.5, blackLevels[4])
        },
        keys: {
            bg: darken(0.05, blackLevels[2]),
            text: lighten(0.05, blackLevels[4])
        },
        cursor: {
            color: themeBase.night,
            bg: transparentize(.78, blackLevels[1])
        },
        blur: transparentize(0.55, blackLevels[1]),
        accent: themeBase.night,
        accentColor: themeBase.night, // todo: rename accentColor -> accen
        background: '#343434',
        textBase: '#fff',
        border: '0.05rem solid #686868',
        buttons: makeButtonThemes(themeBase.night)
    },
    day: {
        base: {
            bg: blackLevels[6],
            text: blackLevels[3]
        },
        menus: {
            bg: blackLevels[5],
            text: blackLevels[3]
        },
        card: {
            body: blackLevels[6],
            head: blackLevels[5],
            text: blackLevels[3],
            border: lighten(0.5, blackLevels[3])
        },
        keys: {
            bg: darken(0.10, blackLevels[5]),
            text: lighten(0.05, blackLevels[2])
        },
        cursor: {
            color: themeBase.day,
            bg: transparentize(.84, themeBase.day)
        },
        blur: transparentize(0.75, blackLevels[6]),
        accent: themeBase.day,
        accentColor: themeBase.day,
        background: '#f7f8f9',
        textBase: '#000',
        border: '0.05rem solid #dadee4',
        buttons: makeButtonThemes(themeBase.day)
    }
}

export default themes;
