import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ArronaxApp } from '../containers/App';

export default () => (
  <Switch>
      <Route exact path="/:platform/:network" component={ArronaxApp} />
      <Route exact path="/">
        <Redirect to="/tezos/mainnet" />
      </Route>
      <Redirect to="/" />
    </Switch>
);