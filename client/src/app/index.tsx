import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import { AppRouter } from 'app/pages/AppRouter';
import { AuthContextProvider } from 'hooks/useAuthContext';

import { queryClient } from 'utils/queryClient';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};
