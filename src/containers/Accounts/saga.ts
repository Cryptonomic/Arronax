import { call, put, select, takeLatest } from 'redux-saga/effects';
import { TezosConseilQuery } from 'conseiljs';
import { makeSelectFilters, makeSelectNetwork } from 'containers/App/selectors';
import { TezosAccount } from 'types';
import config from 'config';
import { FETCH_ACCOUNTS } from './constants';
import { setAccounts } from './actions';

export function* fetchAccounts() {
  const filters = yield select(makeSelectFilters());
  const network = yield select(makeSelectNetwork());
  const { getAccounts } = TezosConseilQuery;
  const apiKey = config.key;
  const url = `${config.url}${network}`;

  try {
    const accounts: TezosAccount[] = yield call(getAccounts, url, filters, apiKey);
    yield put(setAccounts(accounts));
  } catch (err) {
    console.log(err);
  }
}

export default function* watch() {
  yield takeLatest(FETCH_ACCOUNTS, fetchAccounts);
}
