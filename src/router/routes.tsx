import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ArronaxApp } from '../containers/App';

export const defaultPath = '/tezos/mainnet/blocks';

export default () => {
  const routes = [
    '/:platform/:network/:entity/:id', 
    '/:platform/:network/:entity/query/:id', 
    '/:platform/:network/:entity'
  ];

  return (
    <Switch>
        <Route exact path={routes} component={ArronaxApp} />
        <Route exact path="/">
          <Redirect to={defaultPath} />
        </Route>
        <Redirect to="/" />
      </Switch>
  );
}