import { fromJS } from 'immutable';
import { AccountsStateMap } from 'types';
import { AccountsAction } from './actions';
import { SET_ACCOUNTS, FETCH_ACCOUNTS } from './constants';

export const initialState: AccountsStateMap = fromJS({
  items: [],
  fetching: false
});

export default (
  state: AccountsStateMap = initialState,
  action: AccountsAction
): AccountsStateMap => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return state.set('fetching', true);
    case SET_ACCOUNTS:
      return state.set('items', fromJS(action.accounts)).set('fetching', false);
    default:
      return state;
  }
};
