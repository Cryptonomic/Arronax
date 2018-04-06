import { ConseilFilter } from './Conseil';

export interface ArronaxState {
    filters: ConseilFilter;
    mode: Mode;
    dataView: DataView;
    network: string;
}

export enum Mode {Basic, Advanced}

export enum DataView {Blocks, Accounts, Operations}

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
    counter: 2;
}