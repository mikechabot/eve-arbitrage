import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';

import { AppRouter } from 'app/pages/AppRouter';

import { AppHeader } from 'app/components/AppHeader';

import { AuthContextProvider } from 'hooks/useAuthContext';
import { SelectedAssetProvider } from 'hooks/useSelectedAssetsContext';

import { queryClient } from 'utils/queryClient';
import { theme } from 'styles/theme';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SelectedAssetProvider>
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <AppHeader />
              <AppRouter />
            </BrowserRouter>
          </ChakraProvider>
        </SelectedAssetProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};
