import { ConseilSortDirection } from 'conseiljs';

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
