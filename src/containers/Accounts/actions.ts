import { TezosAccount } from 'types';
import {FETCH_ACCOUNTS, FETCH_ACCOUNTS_FAILED, SET_ACCOUNTS} from './constants';

export interface FetchAccounts {
  type: FETCH_ACCOUNTS;
}

export interface SetAccounts {
  type: SET_ACCOUNTS;
  accounts: TezosAccount[];
}

export interface FetchAccountsFailed {
  type: FETCH_ACCOUNTS_FAILED;
  error: string;
}

export type AccountsAction = FetchAccounts | SetAccounts | FetchAccountsFailed;

export const fetchAccounts = (): FetchAccounts => ({
  type: FETCH_ACCOUNTS
});

export const setAccounts = (accounts: TezosAccount[]): SetAccounts => ({
  accounts,
  type: SET_ACCOUNTS
});

export const fetchAccountsFailed = (error: string): FetchAccountsFailed => ({
  type: FETCH_ACCOUNTS_FAILED,
  error
});
