import invariant from 'invariant';
import { conformsTo, isEmpty, isFunction, isString } from 'lodash';
import checkStore from './checkStore';
import { DAEMON, ONCE_TILL_UNMOUNT, RESTART_ON_REMOUNT } from './constants';

const allowedModes = [RESTART_ON_REMOUNT, DAEMON, ONCE_TILL_UNMOUNT];

const checkKey = key =>
  invariant(
    isString(key) && !isEmpty(key),
    '(app/utils...) injectSaga: Expected `key` to be a non empty string'
  );

const checkDescriptor = descriptor => {
  const shape = {
    mode: mode => isString(mode) && allowedModes.includes(mode),
    saga: isFunction
  };
  invariant(
    conformsTo(descriptor, shape),
    '(app/utils...) injectSaga: Expected a valid saga descriptor'
  );
};
// tslint:disable: no-any
export const injectSagaFactory = (store, isValid) => (
  key,
  descriptor: any = {},
  args
) => {
  if (!isValid) {
    checkStore(store);
  }

  const newDescriptor = {
    ...descriptor,
    mode: descriptor.mode || RESTART_ON_REMOUNT
  };
  const { saga, mode } = newDescriptor;

  checkKey(key);
  checkDescriptor(newDescriptor);

  let hasSaga = Reflect.has(store.injectedSagas, key);

  if (process.env.NODE_ENV !== 'production') {
    const oldDescriptor = store.injectedSagas[key];
    if (hasSaga && oldDescriptor.saga !== saga) {
      oldDescriptor.task.cancel();
      hasSaga = false;
    }
  }

  if (!hasSaga || (hasSaga && mode !== DAEMON && mode !== ONCE_TILL_UNMOUNT)) {
    store.injectedSagas[key] = {
      ...newDescriptor,
      task: store.runSaga(saga, args)
    };
  }
};

export const ejectSagaFactory = (store, isValid) => key => {
  if (!isValid) {
    checkStore(store);
  }

  checkKey(key);

  if (Reflect.has(store.injectedSagas, key)) {
    const descriptor = store.injectedSagas[key];
    if (descriptor.mode && descriptor.mode !== DAEMON) {
      descriptor.task.cancel();
      if (process.env.NODE_ENV === 'production') {
        store.injectedSagas[key] = 'done';
      }
    }
  }
};

export const getInjectors = store => {
  checkStore(store);

  return {
    ejectSaga: ejectSagaFactory(store, true),
    injectSaga: injectSagaFactory(store, true)
  };
};
