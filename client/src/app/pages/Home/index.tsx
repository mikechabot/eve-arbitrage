import React from 'react';
import { Redirect } from 'react-router';

import { useAuthContext } from 'hooks/useAuthContext';
import { buildEveAuthBaseUrl } from 'app/utils/constants';

import { AppRoutes } from 'app/pages/appRoutes';

import logo from 'app/assets/eve-sso-login-black-large.png';

export const Home = () => {
  const { localStateKey, verifyData, isVerified, isErrorVerify, isLoadingVerify } =
    useAuthContext();

  /**
   * We should always have a "localStateKey", but check it as
   * a safety measure. If we don't have "verifyData" then
   * we're most likely about to fetch.
   */
  if (!localStateKey || !verifyData) {
    return null;
  }

  if (isErrorVerify) {
    return <span>Error during verification</span>;
  }

  if (isLoadingVerify) {
    return <span>Loading...</span>;
  }

  if (isVerified) {
    return <Redirect to={AppRoutes.Assets} />;
  }

  return (
    <div>
      <header>
        <a className="App-link" href={buildEveAuthBaseUrl(localStateKey)} rel="noopener noreferrer">
          <img src={logo} className="App-logo" alt="logo" />
        </a>
      </header>
    </div>
  );
};
