import React from "react";
import PropTypes from "prop-types";
import hoistNonReactStatics from "hoist-non-react-statics";
import getInjectors from "./sagaInjectors";
import { ONCE_TILL_UNMOUNT } from "./constants";

export default ({ key, saga, mode = ONCE_TILL_UNMOUNT }) => WrappedComponent => {
  class InjectSaga extends React.Component {
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };
    static displayName = `withSaga(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component"})`;

    componentWillMount() {
      const { injectSaga } = this.injectors;

      injectSaga(key, { saga, mode }, this.props);
    }

    componentWillUnmount() {
      const { ejectSaga } = this.injectors;

      ejectSaga(key);
    }

    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(InjectSaga, WrappedComponent);
};
