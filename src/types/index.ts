import { ConseilSortDirection, ConseilFunction } from 'conseiljs';

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
  EXPORT = 'export',
  AGGREGATION = 'aggregation'
}

export interface Config {
  url: string;
  apiKey: string;
  platform: string;
  network: string;
  displayName: string;
  entities?: string[];
  isLocal?: boolean;
};

export interface Sort {
  order: ConseilSortDirection;
  orderBy: string;
}

export interface Aggregation {
  name: string;
  function?: ConseilFunction;
  type: string;
}
