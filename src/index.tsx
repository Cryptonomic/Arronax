import * as React from 'react';
import * as ReactDOM from 'react-dom';
import mode from './reducers/reducers';
import { createStore } from 'redux';
import { ArronaxState, DataView, Mode } from './types/types';
import { Provider } from 'react-redux';
import Arronax from './containers/Arronax';

const store = createStore<ArronaxState>(mode, {
    filters: {blockID: 'None', accountID: 'None', operationID: 'None'},
    mode: Mode.Basic,
    dataView: DataView.Blocks,
});

ReactDOM.render(
    <Provider store={store}>
        <Arronax />
    </Provider>,
    document.getElementById('root')
);
