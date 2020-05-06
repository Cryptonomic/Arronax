import { SET_MODAL_OPEN, SET_MODAL_ITEMS, CLEAN_MODAL, SET_MODULE, SET_MODAL_LOADING } from './types';

const initialState: any = {
    id: '',
    open: false,
    isModalLoading: true,
    list: [],
    modules: {},
};

export const modal = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_MODAL_OPEN:
            return { ...state, open: action.value };
        case SET_MODAL_ITEMS:
            const { platform, network, entity, id, items } = action;
            const list = [...state.list, { platform, network, entity, id, items }];
            return { ...state, id, list };
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
