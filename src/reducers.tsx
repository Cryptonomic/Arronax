import { ArronaxAction } from './actions';
import { ArronaxState } from './types';
import { SET_FILTER, SWITCH_TAB, SET_NETWORK } from './constants';

export default function applyArronaxAction(state: ArronaxState, action: ArronaxAction): ArronaxState {
    switch (action.type) {
        case SET_FILTER:
            return { ...state, filters: action.filters };
        case SWITCH_TAB:
            return { ...state, dataView: action.dataView };
        case SET_NETWORK:
            return { ...state, network: action.network };
        default:
            return state;
    }
}
