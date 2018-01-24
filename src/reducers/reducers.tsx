import { ArronaxAction } from '../actions/actions';
import { ArronaxState, Mode, DataView, Filter } from '../types/types';
import { SWITCH_MODE, SWITCH_TAB, SET_FILTER, RESET_ALL,
          BLOCKS, ACCOUNTS, OPERATIONS,
          BLOCK_ID, ACCOUNT_ID, OPERATION_ID } from "../constants/constants";
import { combineReducers } from 'redux'

export function mode(state: ArronaxState, action: ArronaxAction): ArronaxState {
  return { ...state, mode: Mode.Basic ? Mode.Advanced : Mode.Basic };
}

export function view(state: ArronaxState, action: ArronaxAction): ArronaxState {
    switch (action.type) {
        case BLOCKS:
            return { ...state, view: Mode.Basic };
        case ACCOUNTS:
            return { ...state, view: Mode.Basic };
        case OPERATIONS:
            return { ...state, view: Mode.Basic };
    }
    return state;
}

export function filter(state: ArronaxState, action: ArronaxAction): ArronaxState {
    switch (action.type) {
        case BLOCK_ID:
            return { ...state, filter: Mode.Basic };
        case ACCOUNT_ID:
            return { ...state, filter: Mode.Basic };
        case OPERATION_ID:
            return { ...state, filter: Mode.Basic };
    }
    return state;
}

const reducerCombo = combineReducers({
  mode,
  view,
  filter
})

export default reducerCombo
