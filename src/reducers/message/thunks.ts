import { createMessage } from './actions';

export const addMessage = (message: string, isError: boolean) => {
  return (dispatch: any) => {
    dispatch(createMessage(message, isError));
  };
}
