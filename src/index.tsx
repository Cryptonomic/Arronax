import * as React from 'react';
import * as ReactDOM from 'react-dom';
import applyArronaxAction from './reducers';
import { createStore } from 'redux';
import { ArronaxState, DataView, Mode } from './types';
import { Provider } from 'react-redux';
import Arronax from './containers';

const store = createStore<ArronaxState>(applyArronaxAction, {
    filters: {
        block_id: ['BKicZSTXo4dtHiJcnbAQqJQVwfk2K1xn2MV4zhamXaTGs6xxfGi'],
        block_level: new Array(),
        block_netid: new Array(),
        block_protocol: new Array(),
        operation_id: new Array(),
        operation_source: new Array(),
        account_id: new Array(),
        account_manager: new Array(),
        account_delegate: new Array(),
        limit: 100
    },
    mode: Mode.Basic,
    dataView: DataView.Blocks,
    network: 'zeronet'
});

ReactDOM.render(
    <Provider store={store}>
        <Arronax />
    </Provider>,
    document.getElementById('root')
);
