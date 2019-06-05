import { ConseilSortDirection } from 'conseiljs';
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

export interface Filter {
  name: string;
  operator: string;
  operatorType: string;
  isLowCardinality?: boolean;
  values: Array<string>;
}

export enum ToolType {
  FILTER = 'filter',
  COLUMN = 'column',
  EXPORT = 'export'
}

export interface AttributeDefinition {
  name: string,
  displayName: string,
  dataType: string,
  entity: string,
  keyType: string,
  dataFormat?: string,
  cardinality?: number,
  reference?: AttributeReference,
  scale?: number
}

export interface AttributeReference {
    key: string,
    entity: string
}

export interface Config {
  url: string;
  apiKey: string;
  platform: string;
  network: string;
  displayName: string;
  entities?: string[];
};

export interface Sort {
  order: ConseilSortDirection;
  orderBy: string;
}

export interface EntityDefinition {
  name: string;
  displayName: string;
  displayNamePlural: string;
  count: number;
  network?: string;
}
