import { ConseilSortDirection } from 'conseiljs';

export interface TezosOperationGroup {
  hash: string;
  blockId: string;
  branch: string;
  source: string;
  signature: string;
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
  count: number;
  network?: string;
}
