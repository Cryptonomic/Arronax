import { WithTranslation } from 'react-i18next';
import { AttributeDefinition } from 'conseiljs';
import { Filter } from '../../types';

type OwnProps = {
  availableValues: any;
  selectedEntity: string;
  attributes: AttributeDefinition[];
  filters: Filter[];
  operators: any;
  swipeRef: any;
  fetchValues: (value: string) => void;
  addFilter: (entity: string) => void;
  removeFilter: (entity: string, index: number) => void;
  changeFilter: (entity: string, filter: Filter, index: number) => void;
  resetFilters: () => void;
  onSubmit: () => void;
};

export type FilterPanelProps = OwnProps & WithTranslation;