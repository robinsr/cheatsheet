import { darken, lighten } from 'polished';

const makeButtonThemes = (base) => {
    const white = '#fff';
    const primary =  base;
    const success = '#32b643';
    const danger = '#e85600';
    const error =  darken(0.2, danger);

    const darkWhite =  darken(0.05, white);
    const darkPrimary =  darken(0.05, base);
    const darkSuccess =  darken(0.05, success);
    const darkDanger =  darken(0.05, danger);
    const darkError =  darken(0.25, danger);

    const lightPrimary =  lighten(0.2, base);
    // TODO lighten other variants

    const text = {
        default: primary,
        primary: white,
        success: white,
        danger: white
    }

    const bg = {
        default: white, primary, success, danger
    }

    const hover = {
        default: darkWhite,
        primary: darkPrimary,
        success: darkSuccess,
        danger: darkDanger
    }

    const border = {
        default: primary,
        primary: darkPrimary,
        success: darkSuccess,
        danger: darkDanger
    }

    return { text, bg, border, hover };
}

export default makeButtonThemes;
