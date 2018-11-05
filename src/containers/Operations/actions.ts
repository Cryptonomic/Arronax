import { TezosOperation } from 'types';
import { FETCH_OPERATIONS, SET_OPERATIONS } from './constants';

export interface FetchOperations {
  type: FETCH_OPERATIONS;
}

export interface SetOperations {
  type: SET_OPERATIONS;
  operations: TezosOperation[];
}

export type OperationsAction = FetchOperations | SetOperations;

export const fetchOperations = (): FetchOperations => ({
  type: FETCH_OPERATIONS
});

export const setOperations = (operations: TezosOperation[]): SetOperations => ({
  operations,
  type: SET_OPERATIONS
});
