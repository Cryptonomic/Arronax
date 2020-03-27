import { ConseilSortDirection, ConseilFunction } from 'conseiljs';

export interface Filter {
  name: string;
  operator: string;
  operatorType: string;
  isLowCardinality?: boolean;
  values: string[];
}

export enum ToolType {
  FILTER = 'filter',
  COLUMN = 'column',
  EXPORT = 'export',
  AGGREGATION = 'aggregation'
}

export interface Config {
  url: string;
  apiKey: string;
  platform: string;
  network: string;
  displayName: string;
  nodeUrl?: string;
  entities?: string[];
  hiddenEntities?: string[];
  isLocal?: boolean;
};

export interface Sort {
  order: ConseilSortDirection;
  orderBy: string;
}

export interface Aggregation {
  field: string;
  function?: ConseilFunction;
  type: string;
}

export interface Operator {
  name: string;
  displayName: string;
}

export interface ProcessedValue {
  displayName: string;
  name: string;
  value: any;
  entity: string;
}
