/**
 * Uber-inspired color scheme with black and white variations only
 */

const primaryBlack = '#000000';
const primaryWhite = '#FFFFFF';
const lightGray = '#F6F6F6';
const mediumGray = '#E5E5E5';
const darkGray = '#8E8E93';
const charcoal = '#1C1C1E';

export const Colors = {
  light: {
    text: primaryBlack,
    background: primaryWhite,
    tint: primaryBlack,
    icon: primaryBlack,
    tabIconDefault: darkGray,
    tabIconSelected: primaryBlack,
    border: mediumGray,
    card: primaryWhite,
    surface: lightGray,
    placeholder: darkGray,
    disabled: mediumGray,
    success: primaryBlack,
    error: primaryBlack,
    warning: primaryBlack,
  },
  dark: {
    text: primaryWhite,
    background: primaryBlack,
    tint: primaryWhite,
    icon: primaryWhite,
    tabIconDefault: darkGray,
    tabIconSelected: primaryWhite,
    border: charcoal,
    card: charcoal,
    surface: '#1A1A1A',
    placeholder: darkGray,
    disabled: '#2C2C2E',
    success: primaryWhite,
    error: primaryWhite,
    warning: primaryWhite,
  },
};