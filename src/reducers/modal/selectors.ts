// Beware of getting and manipulating state in the app. Object are passed as references. Make sure to clone object before.

import { createSelector } from 'reselect';
import { RootState } from '../index';

export const getModalState = (state: RootState) => state.modal;

export const getModal = createSelector(getModalState, (modal) => modal);
