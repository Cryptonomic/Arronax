import { TezosFilter } from 'conseiljs';
import * as Immutable from 'immutable';

export interface ArronaxState {
  filters: TezosFilter;
  dataView: DataView;
  network: string;
}

export interface ImmutableState {
  filters: ImmutableMap<TezosFilter>;
  dataView: number;
  network: string;
}
/* tslint:disable:no-any */
export interface ImmutableMap<T>
  extends Immutable.Map<string, Immutable.Map<string, any>> {
  toJS(): T;
}

export interface ArronaxImmutableState
  extends Immutable.Map<string, ImmutableMap<TezosFilter> | number | string> {
  toJS(): ArronaxState;
  get<K extends keyof ArronaxState>(
    key: K,
    defaultValue?: ImmutableState[K]
  ): ImmutableState[K];
  set<K extends keyof ArronaxState>(
    key: K,
    value: ImmutableState[K]
  ): ArronaxImmutableState;
}
/* tslint:enable:no-any */

export enum DataView {
  Blocks,
  Accounts,
  Operations
}

export interface TezosBlock {
  netId: string;
  protocol: string;
  level: number;
  proto: number;
  predecessor: string;
  validationPass: string;
  operationsHash: string;
  data: string;
  hash: string;
  timestamp: number;
  fitness: string;
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
