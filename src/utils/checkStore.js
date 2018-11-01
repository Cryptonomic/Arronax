import conformsTo from "lodash/conformsTo";
import isFunction from "lodash/isFunction";
import isObject from "lodash/isObject";
import invariant from "invariant";

/**
 * Validate the shape of redux store
 */
export default function checkStore(store) {
  const shape = {
    dispatch: isFunction,
    getState: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
    replaceReducer: isFunction,
    runSaga: isFunction,
    subscribe: isFunction,
  };
  invariant(
    conformsTo(store, shape),
    "(app/utils...) injectors: Expected a valid redux store",
  );
}
