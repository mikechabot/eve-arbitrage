import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Page } from 'app/layout/Page';

import { Home } from './Home';
import { Auth } from './Auth';
import { Assets } from './Assets';
import { Orders } from './Orders';

import { AppRoutes } from './appRoutes';

export const AppRouter = () => {
  return (
    <Page>
      <Switch>
        <Route exact path={AppRoutes.Home} component={Home} />
        <Route exact path={AppRoutes.AuthSso} component={Auth} />
        <Route exact path={AppRoutes.Assets} component={Assets} />
        <Route exact path={AppRoutes.Orders} component={Orders} />
      </Switch>
    </Page>
  );
};
