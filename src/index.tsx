import * as React from 'react';
import * as ReactDOM from 'react-dom';
import applyArronaxAction from './reducers/reducers';
import { createStore } from 'redux';
import { ArronaxState, DataView, Mode } from './types/types';
import { Provider } from 'react-redux';
import Arronax from './containers/Arronax';

const store = createStore<ArronaxState>(applyArronaxAction, {
    filters: {
        blockIDs: ['head'],
        levels: new Array(),
        netIDs: new Array(),
        protocols: new Array(),
        operationIDs: new Array(),
        operationSources: new Array(),
        accountIDs: new Array(),
        accountManagers: new Array(),
        accountDelegates: new Array(),
        limit: 100
    },
    mode: Mode.Basic,
    dataView: DataView.Blocks,
});

ReactDOM.render(
    <Provider store={store}>
        <Arronax />
    </Provider>,
    document.getElementById('root')
);
