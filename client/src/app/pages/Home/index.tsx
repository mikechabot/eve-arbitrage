import React from 'react';
import logo from 'app/assets/eve-sso-login-black-large.png';

import { EveAuthBaseUrl } from 'app/utils/constants';

export const Home = () => {
  return (
    <div>
      <header>
        <a className="App-link" href={EveAuthBaseUrl} rel="noopener noreferrer">
          <img src={logo} className="App-logo" alt="logo" />
        </a>
      </header>
    </div>
  );
};
