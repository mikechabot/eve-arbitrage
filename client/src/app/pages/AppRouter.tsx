import React from 'react';
import { Box } from '@chakra-ui/react';
import { Route, Switch } from 'react-router-dom';

import { Home } from './Home';
import { Auth } from './Auth';
import { Assets } from './Assets';
import { Orders } from './Orders';

import { AppRoutes } from './appRoutes';

export const AppRouter = () => {
  return (
    <Box top="98px" position="relative" height="calc(100% - 98px)">
      <Switch>
        <Route exact path={AppRoutes.Home} component={Home} />
        <Route exact path={AppRoutes.AuthSso} component={Auth} />
        <Route exact path={AppRoutes.Assets} component={Assets} />
        <Route exact path={AppRoutes.Orders} component={Orders} />
      </Switch>
    </Box>
  );
};
