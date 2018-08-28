import invariant from 'invariant';
import { conformsTo, isFunction, isObject } from 'lodash';

/**
 * Validate the shape of redux store
 */
 // tslint:disable: no-any
export default function checkStore(store: any) {
  const shape = {
    dispatch: isFunction,
    getState: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
    replaceReducer: isFunction,
    runSaga: isFunction,
    subscribe: isFunction
  };
  invariant(
    conformsTo(store, shape),
    '(app/utils...) injectors: Expected a valid redux store'
  );
}
