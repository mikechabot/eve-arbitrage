import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

import { AppRouter } from 'app/pages/AppRouter';
import { AuthContextProvider } from 'hooks/useAuthContext';

import { queryClient } from 'utils/queryClient';
import { Header } from './components/Header';

const fonts = {
  body: 'Teko, sans-serif',
  heading: 'Teko, sans-serif',
  mono: `'JetBrains Mono', monospaced`,
};

const fontSizes = {
  xs: '1rem',
  sm: '1.125rem',
  md: '1.25rem',
  lg: '1.375rem',
  xl: '1.5rem',
  '2xl': '1.75rem',
  '3xl': '2.125rem',
  '4xl': '2.50rem',
  '5xl': '3.50rem',
  '6xl': '4.25rem',
  '7xl': '6rem',
  '8xl': '8rem',
  '9xl': '10rem',
};

const colors = {
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

const theme = extendTheme({ colors, fonts, fontSizes });

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <Header />
            <AppRouter />
          </BrowserRouter>
        </ChakraProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};
