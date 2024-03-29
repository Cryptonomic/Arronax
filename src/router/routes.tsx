import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { ArronaxApp } from '../containers/App';
import {HomePage} from '../containers/Homepage';

export const defaultPath = '/tezos/mainnet/blocks';
export const reQuery = /^\?e=\w+(|%20)\w+\/\w+&q=\w+/;

const QuerySupport = () => {
  const location = useLocation();

  if (reQuery.test(location.search)) {
    return <Route component={ArronaxApp} />;
  }

  return <Redirect to={defaultPath} />;
};

const routes = () => {
  const routes = [
    '/:platform/:network/:entity/:id',
    '/:platform/:network/:entity/query/:id',
    '/:platform/:network/:entity',
  ];

  return (
    <Switch>
      <Route exact path={routes} component={ArronaxApp} />
      <Route exact path='/' component={HomePage} />
      <QuerySupport />
      <Route exact path="/">
        <Redirect to={defaultPath} />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default routes;
