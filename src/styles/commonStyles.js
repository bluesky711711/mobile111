import {
    StyleSheet,
    Dimensions,
    Platform,
  } from 'react-native';

  export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  export const headerHeight = 80;
  export const menuHeight = 60;
  export const viewHeight = screenHeight - headerHeight - menuHeight;

    export function wp(percentage) {
      const value = (percentage * screenWidth) / 100;
      return Math.round(value);
    }

    export function hp(percentage) {
      const value = (percentage * screenHeight) / 100;
      return Math.round(value);
    }

    export function scaleScreen() {

      if (screenWidth > 320)
        return 1;

      return 0.85;
    }

export const background = require('../../public/images/background.png')
export const register = require('../../public/images/register.png')
export const menu = require('../../public/images/background.png')
export const icon = require('../../public/images/icon.png')
