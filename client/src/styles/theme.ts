import { extendTheme } from '@chakra-ui/react';
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

const fonts = {
  body: 'Abel, sans-serif',
  heading: 'Abel, sans-serif',
  mono: `'JetBrains Mono', monospaced`,
};

const styles = {
  global: () => ({
    body: {
      color: 'primary',
      bg: 'base',
    },
  }),
};

const colors = {
  // base: '#EBF5EE',
  // primary: '#78A1BB',
  // secondary: '#283044',
  // base: '#F6E8EA',
  // primary: '#22181C',
  // secondary: '#F45B69',
  base: '#FDFFF7',
  primary: '#1C1C1C',
  secondary: '#2292A4',
  // base: '#EBF5EE',
  // primary: '#1F7A8C',
  // secondary: '#022B3A',
  red: {
    100: '#D70A53',
  },
  green: {
    100: '#20C20E',
    200: '#168709',
  },
  gray: {
    100: '#E9E9E9',
    200: '#BABABA',
    250: '#4A4A4A',
    300: '#303030',
    400: '#242424',
    500: '#1A1A1A',
    600: '#101010',
  },
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const sizes = {
  container: {
    xxl: '1440px',
  },
};

export const theme = extendTheme({
  styles,
  colors,
  fonts,
  sizes,
  components: {
    Steps,
  },
});
