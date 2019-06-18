import { CLEAR_MESSAGE_STATE, ADD_MESSAGE } from './types';

export function clearMessageAction() {
  return {
    type: CLEAR_MESSAGE_STATE
  }
}

export function createMessageAction(message: string, isError: boolean) {
  return {
    type: ADD_MESSAGE,
    message,
    isError
  }
}
