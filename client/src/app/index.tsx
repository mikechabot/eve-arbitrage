import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

import { AppRouter } from 'app/pages/AppRouter';
import { AuthContextProvider } from 'hooks/useAuthContext';

import { queryClient } from 'utils/queryClient';

const fonts = {
  body: `'Signika Negative', sans-serif`,
  heading: `'Signika Negative', sans-serif`,
  mono: `'JetBrains Mono', monospaced`,
};

const colors = {
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

const theme = extendTheme({ colors, fonts });

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ChakraProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};
