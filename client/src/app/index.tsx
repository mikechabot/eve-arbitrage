import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

import { AppRouter } from 'app/pages/AppRouter';
import { AuthContextProvider } from 'hooks/useAuthContext';

import { queryClient } from 'utils/queryClient';
import { AppHeader } from './components/AppHeader';

const fonts = {
  body: 'Teko, sans-serif',
  heading: 'Teko, sans-serif',
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
  base: '#F6E8EA',
  primary: '#22181C',
  secondary: '#F45B69',
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

const theme = extendTheme({ styles, colors, fonts });

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <AppHeader />
            <AppRouter />
          </BrowserRouter>
        </ChakraProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};
