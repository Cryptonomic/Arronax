import * as Immutable from 'immutable';
import { TezosFilter } from 'conseiljs';

export interface ArronaxState {
    filters: TezosFilter;
    network: string;
}

export enum DataView {
  Blocks,
  Accounts,
  Operations
}

export interface ArronaxStateImmutable {
  filters: ImmutableMap<TezosFilter>;
  network: string;
}
/* tslint:disable:no-any */
export interface ImmutableMap<T> extends Immutable.Map<string, Immutable.Map<string, any>> {
  toJS(): T;
}

export interface ArronaxStateMap extends Immutable.Map<string, any> {
  toJS(): ArronaxState;
  get<K extends keyof ArronaxStateImmutable>(key: K): ArronaxStateImmutable[K];
}
/* tslint:enable:no-any */

export interface BlocksState {
  items: ImmutableMap<TezosBlock[]>;
  fetching: boolean;
  error: string;
}

export interface BlocksStateMap extends Map<string, any> {
  toJS(): BlocksState;
  get<K extends keyof BlocksState>(key: K): BlocksState[K];
  set<K extends keyof BlocksState>(
    key: K,
    value: BlocksState[K]
  ): this;
}

export interface AccountsState {
  items: ImmutableMap<TezosAccount[]>;
  fetching: boolean;
  error: string;
}

export interface AccountsStateMap extends Map<string, any> {
  toJS(): AccountsState;
  get<K extends keyof AccountsState>(key: K): AccountsState[K];
  set<K extends keyof AccountsState>(
    key: K,
    value: AccountsState[K]
  ): this;
}

export interface OperationsState {
  items: ImmutableMap<TezosOperation[]>;
  fetching: boolean;
}

export interface OperationsStateMap extends Map<string, any> {
  toJS(): OperationsState;
  get<K extends keyof OperationsState>(key: K): OperationsState[K];
  set<K extends keyof OperationsState>(
    key: K,
    value: OperationsState[K]
  ): this;
}

export interface GlobalState {
  global: ArronaxStateMap;
  blocks: BlocksStateMap;
  accounts: AccountsStateMap;
  operations: OperationsStateMap;
}

export interface GlobalStateMap extends Map<string, any> {
  toJS(): GlobalState;
  get<K extends keyof GlobalState>(key: K, defaultValue?: GlobalState[K]): GlobalState[K];
  set<K extends keyof GlobalState>(
    key: K,
    value: GlobalState[K]
  ): this;
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
