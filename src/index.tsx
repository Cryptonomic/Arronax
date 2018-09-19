import * as React from 'react';
import * as ReactDOM from 'react-dom';
import applyArronaxAction from './reducers';
import { createStore } from 'redux';
import { ArronaxState, DataView } from './types';
import { Provider } from 'react-redux';
import Arronax from './containers';

const store = createStore(applyArronaxAction);

ReactDOM.render(
    <Provider store={store}>
        <Arronax />
    </Provider>,
    document.getElementById('root')
);
