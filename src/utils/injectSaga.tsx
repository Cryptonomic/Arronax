import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as PropTypes from 'prop-types';
import { getInjectors } from './sagaInjectors';
import { DAEMON } from './constants';

export default ({ key, saga, mode = DAEMON }) => WrappedComponent => {
  class InjectSaga extends React.Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };
    static displayName = `withSaga(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;
    static WrappedComponent = WrappedComponent;

    injectors = getInjectors(this.context.store);

    componentWillMount() {
      const { injectSaga } = this.injectors;

      injectSaga(key, { saga, mode }, this.props);
    }

    componentWillUnmount() {
      const { ejectSaga } = this.injectors;
      ejectSaga(key);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(InjectSaga, WrappedComponent);
};
