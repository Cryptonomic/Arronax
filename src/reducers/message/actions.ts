import { CLEAR_MESSAGE_STATE, ADD_MESSAGE } from './types';

export function clearMessageState() {
  return {
    type: CLEAR_MESSAGE_STATE
  }
}

export function createMessage(message: string, isError: boolean) {
  return {
    type: ADD_MESSAGE,
    message,
    isError
  }
}
