import { SET_MODAL_OPEN, SET_MODAL_ITEMS, SET_MODAL_SELECTED_ITEM, CLEAN_MODAL, SET_MODULE, SET_MODAL_LOADING, SET_MODAL_LOADED } from './types';

export const setModalOpen = (value: boolean) => ({
  type: SET_MODAL_OPEN,
  value
});

export const setModalItems = (platform: string, network: string, entity: string, id: string | number, items: any) => ({
    type: SET_MODAL_ITEMS,
    platform,
    network,
    entity,
    id,
    items,
});

export const setModalSelectedItem = (item: any) => ({
  TYPE: SET_MODAL_SELECTED_ITEM,
  item
});

export const cleanModal = () => ({
  type: CLEAN_MODAL
});

export const setModule = (name: string, items: any) => ({
  type: SET_MODULE,
  name,
  items
});

export const setModalLoading = (value: boolean) => ({
  type: SET_MODAL_LOADING,
  value
});

export const setModalLoaded = (value: boolean) => ({
  type: SET_MODAL_LOADED,
  value
});
