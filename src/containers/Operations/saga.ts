import { call, put, select, takeLatest } from 'redux-saga/effects';
import { TezosConseilQuery } from 'conseiljs';
import { makeSelectFilters, makeSelectNetwork } from 'containers/App/selectors';
import { TezosOperation } from 'types';
import config from 'config';
import { FETCH_OPERATIONS } from './constants';
import { setOperations } from './actions';

export function* fetchOperations() {
  const filters = yield select(makeSelectFilters());
  const network = yield select(makeSelectNetwork());
  const { getOperations } = TezosConseilQuery;
  const apiKey = config.key;
  const url = `${config.url}${network}`;

  try {
    const operations: TezosOperation[] = yield call(getOperations, url, filters, apiKey);
    yield put(setOperations(operations));
  } catch (err) {
    console.log(err);
  }
}

export default function* watch() {
  yield takeLatest(FETCH_OPERATIONS, fetchOperations);
}
