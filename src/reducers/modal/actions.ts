import { TOGGLE_MODAL, SET_MODAL, CLEAN_MODAL } from './types';

export const toggleModal = () => ({
  type: TOGGLE_MODAL
});

export const setModalItems = (entity: string, items: any[]) => ({
    type: SET_MODAL,
    entity,
    items,
});

export const cleanModal = () => ({
  type: CLEAN_MODAL
});
