import { call, put, select, takeLatest } from 'redux-saga/effects';
import { TezosConseilQuery } from 'conseiljs';
import { makeSelectFilters, makeSelectNetwork } from 'containers/App/selectors';
import { TezosBlock } from 'types';
import config from 'config';
import { FETCH_BLOCKS } from './constants';
import {fetchBlocksFailed, setBlocks} from './actions';

export function* fetchBlocks() {
  const filters = yield select(makeSelectFilters());
  const network = yield select(makeSelectNetwork());
  const { getBlocks } = TezosConseilQuery;
  const apiKey = config.key;
  const url = `${config.url}${network}`;

  try {
    const blocks: TezosBlock[] = yield call(getBlocks, url, filters, apiKey);
    yield put(setBlocks(blocks));
  } catch (err) {
    yield put(fetchBlocksFailed(err.message));
  }
}

export default function* watch() {
  yield takeLatest(FETCH_BLOCKS, fetchBlocks);
}
