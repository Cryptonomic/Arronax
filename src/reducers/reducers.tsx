import { ArronaxAction } from '../actions/actions';
import { ArronaxState, Mode } from '../types/types';
import { SWITCH_MODE, SET_FILTER, SWITCH_TAB } from '../constants/constants';

export default function applyArronaxAction(state: ArronaxState, action: ArronaxAction): ArronaxState {
    switch (action.type) {
        case SWITCH_MODE:
            const newMode = state.mode === Mode.Basic ? Mode.Advanced : Mode.Basic;
            return { ...state, mode: newMode };
        case SET_FILTER:
            let newFilters = action.filters;
            return { ...state, filters: newFilters };
        case SWITCH_TAB:
            return { ...state, dataView: action.dataView };
        default:
            return state;
    }
}
