import { TOGGLE_MODAL, SET_MODAL, CLEAN_MODAL, SET_BLOCK_OPERATIONS_MODULE } from './types';

const initialState: any = {
    entity: '',
    open: false,
    items: {},
    modules: {}
};

export const modal = (state = initialState, action: any) => {
    switch (action.type) {
        case TOGGLE_MODAL:
            return { ...state, open: !state.open };
        case SET_MODAL: {
            const items = { ...state.items, [action.entity]: action.items };
            return {
                ...state,
                entity: action.entity,
                items,
            };
        }
        case CLEAN_MODAL: {
            return initialState;
        }
        case SET_BLOCK_OPERATIONS_MODULE: {
            const modules = { ...state.modules, [action.name]: action.items };
            return { ...state, modules };
        }
        default: {
            return state;
        }
    }
};
