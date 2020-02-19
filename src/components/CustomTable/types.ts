import { EntityDefinition } from 'conseiljs';

import { Sort, Config, Aggregation } from '../../types';

export interface Props {
  rowsPerPage: number;
  items: any[];
  selectedColumns: any[];
  selectedConfig: Config;
  selectedEntity: string;
  selectedModalItem: object;
  attributes: any;
  isLoading: boolean;
  selectedSort: Sort;
  entities: EntityDefinition[];
  isModalUrl?: boolean;
  aggregations: Aggregation[];
  onExportCsv: () => void;
  getModalItemAction: (entity: string, key: string, value: string | number) => void;
  onSubmitQuery: () => void;
  onSetSort: (entity: string, sorts: Sort[]) => void;
  updateRoute: (redirect?: boolean, entity?: string, id?: string | number) => void;
}

export interface State {
  page: number;
  isOpenedModal: boolean;
  selectedPrimaryKey: string;
  selectedPrimaryValue: string | number;
  referenceEntity: string;
}