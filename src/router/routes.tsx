import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ArronaxApp } from '../containers/App';

export default () => (
  <Switch>
      <Route exact path={['/:platform/:network/:entity/:id', '/:platform/:network/:entity/query/:id', '/:platform/:network/:entity', ]} component={ArronaxApp} />
      <Route exact path="/">
        <Redirect to="/tezos/mainnet/blocks" />
      </Route>
      <Redirect to="/" />
    </Switch>
);