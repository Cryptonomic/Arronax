import { fromJS } from 'immutable';
import { AccountsStateMap } from 'types';
import { AccountsAction } from './actions';
import { SET_ACCOUNTS, FETCH_ACCOUNTS, FETCH_ACCOUNTS_FAILED } from './constants';

export const initialState: AccountsStateMap = fromJS({
  items: [],
  fetching: false,
  error: ''
});

export default (
  state: AccountsStateMap = initialState,
  action: AccountsAction
): AccountsStateMap => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return state.set('fetching', true).set('error', '');
    case SET_ACCOUNTS:
      return state.set('items', fromJS(action.accounts)).set('fetching', false);
    case FETCH_ACCOUNTS_FAILED:
      return state.set('fetching', false).set('error', action.error);
    default:
      return state;
  }
};
