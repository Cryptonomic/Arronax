import { ArronaxAction } from '../actions/actions';
import { ArronaxState, Mode } from '../types/types';
import { SWITCH_MODE } from '../constants/constants';

export default function mode(state: ArronaxState, action: ArronaxAction): ArronaxState {
    switch (action.type) {
        case SWITCH_MODE:
            var newMode = state.mode === Mode.Basic ? Mode.Advanced : Mode.Basic;
            return { ...state, mode: newMode };
        default:
            return state;
    }
}
