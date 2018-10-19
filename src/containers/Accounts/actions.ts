import { TezosAccount } from 'types';
import { FETCH_ACCOUNTS, SET_ACCOUNTS } from './constants';

export interface FetchAccounts {
  type: FETCH_ACCOUNTS;
}

export interface SetAccounts {
  type: SET_ACCOUNTS;
  accounts: TezosAccount[];
}

export type AccountsAction = FetchAccounts | SetAccounts;

export const fetchAccounts = (): FetchAccounts => ({
  type: FETCH_ACCOUNTS
});

export const setAccounts = (accounts: TezosAccount[]): SetAccounts => ({
  accounts,
  type: SET_ACCOUNTS
});
