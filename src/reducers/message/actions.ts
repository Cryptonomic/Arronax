import { CLEAR_MESSAGE_STATE, ADD_MESSAGE } from './types';

export function clearMessageAction() {
  return {
    type: CLEAR_MESSAGE_STATE
  }
}

export function createMessageAction(message: string, isError: boolean) {
    if (isError) {
        try { throw new Error(message); }
        catch (err) {
            console.log(err.message);
            console.log(err.stack);
        }
    }
  return {
    type: ADD_MESSAGE,
    message,
    isError
  }
}
