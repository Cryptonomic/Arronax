import { SET_MODAL_OPEN, SET_MODAL_ITEMS, CLEAN_MODAL, SET_MODULE, SET_MODAL_LOADING, SET_MODAL_SELECTED_ITEM, SET_MODAL_LOADED } from './types';

const initialState: any = {
    entity: '',
    id: '',
    open: false,
    isModalLoading: true,
    isModalLoaded: false,
    selectedItem: null,
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
            return { ...state, list };
        case SET_MODAL_SELECTED_ITEM: {
            const { selectedItem } = action;
            return { ...state, selectedItem };
        }
        case CLEAN_MODAL:
            return initialState;
        case SET_MODULE:
            const modules = { ...state.modules, [action.name]: action.items };
            return { ...state, modules };
        case SET_MODAL_LOADING:
            return { ...state, isModalLoading: action.value };
        case SET_MODAL_LOADED:
            return { ...state, isModalLoaded: action.value };
        default: {
            return state;
        }
    }
};
