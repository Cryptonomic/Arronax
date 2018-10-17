import { TezosFilter } from 'conseiljs';
import * as Immutable from 'immutable';

export interface ArronaxState {
    filters: TezosFilter;
    network: string;
}

export interface ImmutableState {
  filters: ImmutableMap<TezosFilter>;
  dataView: number;
  network: string;
}
/* tslint:disable:no-any */
export interface ImmutableMap<T> extends Immutable.Map<string, Immutable.Map<string, any>> {
  toJS(): T;
}

export interface ArronaxImmutableState extends Immutable.Map<string, any> {
  toJS(): ArronaxState;
  get<K extends keyof ArronaxState>(key: K): ImmutableState[K];
}
/* tslint:enable:no-any */

export enum DataView {
  Blocks,
  Accounts,
  Operations
}

export interface TezosBlock {
  level: number;
  proto: number;
  predecessor: string;
  timestamp: number;
  validationPass: number;
  fitness: string;
  context: string;
  signature: string;
  protocol: string;
  chainId: string;
  hash: string;
  operationsHash: string;
}

export interface TezosOperation {
  kind: string;
  source: string;
  amount: string;
  destination: string;
  manager_pub_key: string;
  balance: string;
  delegate: string;
  operationGroupHash: string;
  operationId: number;
  fee: string;
  storageLimit: string;
  gasLimit: string;
  blockHash: string;
  timestamp: number;
  blockLevel: number;
}

export interface TezosOperationGroup {
  hash: string;
  blockId: string;
  branch: string;
  source: string;
  signature: string;
}

export interface TezosAccount {
  accountId: string;
  blockId: string;
  manager: string;
  spendable: boolean;
  delegateSetable: boolean;
  delegateValue: string;
  balance: number;
  counter: number;
}
