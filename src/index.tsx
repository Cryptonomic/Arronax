import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Arronax from './containers';

const store = createStore(applyArronaxAction);
const MOUNT_NODE: HTMLElement = document.getElementById('root')!;
const render = () => {
  ReactDOM.render(
    <Provider store={store}>
        <Arronax />
    </Provider>,
    MOUNT_NODE
  );
};

// tslint:disable: no-any
if ((module as any).hot) {
  (module as any).hot.accept(['./containers'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}
// tslint:enable

render();
