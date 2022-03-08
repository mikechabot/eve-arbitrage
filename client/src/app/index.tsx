import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRouter } from 'app/pages/AppRouter';
import { AuthContextProvider } from '../hooks/useAuthContext';

export const App = () => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  );
};
