import { TOGGLE_MODAL, SET_MODAL, CLEAN_MODAL } from './types';

const initialState = {
    entity: '',
    open: false,
    items: [],
    subItems: [],
};

export const modal = (state = initialState, action: any) => {
    switch (action.type) {
        case TOGGLE_MODAL:
            return { ...state, open: !state.open };
        case SET_MODAL: {
            return { ...state, entity: action.entity, items: action.items };
        }
        case CLEAN_MODAL: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};
