import { SET_MODAL_OPEN, SET_MODAL, CLEAN_MODAL, SET_MODULE, SET_MODAL_LOADING } from './types';

const initialState: any = {
    entity: '',
    id: '',
    open: false,
    isModalLoading: true,
    items: {},
    modules: {},
};

export const modal = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_MODAL_OPEN:
            return { ...state, open: action.value };
        case SET_MODAL:
            const items = { ...state.items, [action.entity]: action.items };
            return {
                ...state,
                id: action.id,
                entity: action.entity,
                items,
            };
        case CLEAN_MODAL:
            return initialState;
        case SET_MODULE:
            const modules = { ...state.modules, [action.name]: action.items };
            return { ...state, modules };
        case SET_MODAL_LOADING:
            return { ...state, isModalLoading: action.value };
        default: {
            return state;
        }
    }
};
