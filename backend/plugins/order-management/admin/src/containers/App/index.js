/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
// Containers
import HomePage from '../HomePage';
import OrderPage from '../OrderPage';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}/:view`} component={HomePage} exact />
        <Route path={`/plugins/${pluginId}/view/:id`} component={OrderPage} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
