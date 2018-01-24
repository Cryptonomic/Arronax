import * as React from "react";
import * as ReactDOM from "react-dom";
import reducerCombo from './reducers/reducers'
import { createStore } from 'redux';
import { mode, view, filter } from './reducers/reducers';
import { ArronaxState } from './types/types';
import { Provider } from 'react-redux';
import { Hello } from "./components/Hello";

const store = createStore<ArronaxState>(reducerCombo, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
});

ReactDOM.render(
  <Provider store={store}>
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
  </Provider>
);
