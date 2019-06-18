import { createSelector } from 'reselect';
import { RootState } from '../index';

export const getMessage = (state: RootState) => state.message;

export const getErrorState = createSelector(
  getMessage,
  message => message.isError
);

export const getMessageTxt = createSelector(
  getMessage,
  message => message.message
);

