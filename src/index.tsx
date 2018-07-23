import * as React from 'react';
import * as ReactDOM from 'react-dom';
import applyArronaxAction from './reducers';
import { createStore } from 'redux';
import { ArronaxState, DataView } from './types';
import { Provider } from 'react-redux';
import Arronax from './containers';

const store = createStore<ArronaxState>(applyArronaxAction, {
    filters: {
        block_id: ['BKicZSTXo4dtHiJcnbAQqJQVwfk2K1xn2MV4zhamXaTGs6xxfGi'],
        block_level: [],
        block_netid: [],
        block_protocol: [],
        operation_id: [],
        operation_source: [],
        operation_destination:  [],
        operation_participant: [],
        operation_kind: [],
        account_id: [],
        account_manager: [],
        account_delegate: [],
        limit: 100
    },
    dataView: DataView.Blocks,
    network: 'zeronet'
});

ReactDOM.render(
    <Provider store={store}>
        <Arronax />
    </Provider>,
    document.getElementById('root')
);
