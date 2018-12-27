import { TezosOperation } from 'types';
import {FETCH_OPERATIONS, FETCH_OPERATIONS_FAILED, SET_OPERATIONS} from './constants';

export interface FetchOperations {
  type: FETCH_OPERATIONS;
}

export interface SetOperations {
  type: SET_OPERATIONS;
  operations: TezosOperation[];
}

export interface FetchOperationsFailed {
  type: FETCH_OPERATIONS_FAILED;
  error: string;
}

export type OperationsAction = FetchOperations | SetOperations | FetchOperationsFailed;

export const fetchOperations = (): FetchOperations => ({
  type: FETCH_OPERATIONS
});

export const setOperations = (operations: TezosOperation[]): SetOperations => ({
  operations,
  type: SET_OPERATIONS
});

export const fetchOperationsFailed = (error: string): FetchOperationsFailed => ({
    type: FETCH_OPERATIONS_FAILED,
    error
});
