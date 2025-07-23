
/**
 * Uber color scheme for the app with light and dark mode support
 */

const uberBlack = '#000000';
const uberWhite = '#FFFFFF';
const uberGreen = '#09B83E';
const uberLightGray = '#F6F6F6';
const uberDarkGray = '#1A1A1A';
const uberMediumGray = '#8A8A8A';
const uberRed = '#E11900';
const uberBlue = '#276EF1';

export const Colors = {
  light: {
    text: uberBlack,
    background: uberWhite,
    tint: uberBlack,
    icon: uberMediumGray,
    tabIconDefault: uberMediumGray,
    tabIconSelected: uberBlack,
    primary: uberBlack,
    secondary: uberLightGray,
    accent: uberGreen,
    danger: uberRed,
    info: uberBlue,
    border: '#E5E5E5',
    card: uberWhite,
    surface: uberLightGray,
  },
  dark: {
    text: uberWhite,
    background: uberBlack,
    tint: uberWhite,
    icon: uberMediumGray,
    tabIconDefault: uberMediumGray,
    tabIconSelected: uberWhite,
    primary: uberWhite,
    secondary: uberDarkGray,
    accent: uberGreen,
    danger: uberRed,
    info: uberBlue,
    border: '#333333',
    card: uberDarkGray,
    surface: '#2A2A2A',
  },
};
