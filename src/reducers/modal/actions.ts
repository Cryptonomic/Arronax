import { TOGGLE_MODAL, SET_MODAL, CLEAN_MODAL, SET_BLOCK_OPERATIONS_MODULE } from './types';

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

export const setBlockOperationsModule = (name: string, items: any) => ({
  type: SET_BLOCK_OPERATIONS_MODULE,
  name,
  items
})
