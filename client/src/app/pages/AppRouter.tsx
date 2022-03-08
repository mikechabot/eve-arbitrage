import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Home } from './Home';
import { Auth } from './Auth';

import { AppRoutes } from './appRoutes';

export const AppRouter = () => {
  return (
    <Switch>
      <Route exact path={AppRoutes.Home} component={Home} />
      <Route exact path={AppRoutes.AuthSso} component={Auth} />
    </Switch>
  );
};
