import { createMessageAction } from './actions';

export const addMessage = (message: string, isError: boolean) => {
  return (dispatch: any) => {
    dispatch(createMessageAction(message, isError));
  };
}
