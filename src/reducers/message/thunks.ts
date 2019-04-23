import { createMessage } from './actions';

export const addMessage = (message, isError) => {
  return dispatch => {
    dispatch(createMessage(message, isError));
  };
}
