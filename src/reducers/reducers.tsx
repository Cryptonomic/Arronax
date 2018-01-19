import { ArronaxAction } from '../actions/actions';
import { ArronaxState, Mode } from '../types/types';
import {SET_FILTER, RESET_ALL, SWITCH_MODE, SWITCH_TAB} from "../constants/constants";

export function enthusiasm(state: ArronaxState, action: ArronaxAction): ArronaxState {
    switch (action.type) {
        case SWITCH_MODE:
            return { ...state, mode: Mode.Basic };
        case SWITCH_TAB:
            return { ...state, mode: Mode.Basic };
        case SET_FILTER:
            return { ...state, mode: Mode.Basic };
        case RESET_ALL:
            return { ...state, mode: Mode.Basic };
    }
    return state;
}