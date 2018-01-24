import { ArronaxAction } from '../actions/actions';
import { ArronaxState, Mode } from '../types/types';
import { SWITCH_MODE, SET_FILTER } from '../constants/constants';

export default function applyArronaxAction(state: ArronaxState, action: ArronaxAction): ArronaxState {
    switch (action.type) {
        case SWITCH_MODE:
            const newMode = state.mode === Mode.Basic ? Mode.Advanced : Mode.Basic;
            return { ...state, mode: newMode };
        case SET_FILTER:
            let newFilters = action.filters;
            return { ...state, filters: newFilters };
        default:
            return state;
    }
}
