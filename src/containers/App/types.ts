import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { EntityDefinition } from 'conseiljs';

import { Config } from '../../types';

export interface OwnProps {
  isLoading: boolean;
  configs: Config[];
  selectedConfig: Config;
  selectedEntity: string;
  items: object[];
  isFullLoaded: boolean;
  filterCount: number;
  aggCount: number;
  selectedColumns: EntityDefinition[];
  entities: EntityDefinition[];
  isError: boolean;
  message: string;
  attributes: any;
  selectedModalItem: object;
  rowsPerPage: number;
  removeAllFilters: (entity: string) => void;
  changeNetwork(config: Config): void;
  changeTab: (type: string) => void;
  initLoad: (p: string, n: string, e: string, i: string, t: boolean) => any;
  submitQuery: () => void;
  exportCsvData: ()=> void;
  shareReport: ()=> void;
  initMessage: ()=> void;
  addConfig: (config: Config, isUse: boolean) => void;
  removeConfig: (index: number) => void;
  searchById: (id: string | number) => any;
  getModalItemAction: (entity: string, key: string, value: string | number) => void;
}

export interface States {
  isSettingCollapsed: boolean;
  selectedTool: string;
  isModalUrl: boolean;
  isOpenConfigMdoal: boolean;
  isOpenEntityModal: boolean;
  searchedEntity: string;
  searchedItem: any[];
  searchedSubItems: any[];
  primaryKeyClicked: boolean;
  expandedTabs: boolean;
  page: number;
}

export interface RouteComponentWithParmas extends RouteComponentProps {
  match: {
    params: Record<string, string>
    path: string
    url: string
    isExact: boolean
  }
}

export type Props = OwnProps & RouteComponentWithParmas & WithTranslation;