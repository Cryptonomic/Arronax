import { WithTranslation } from 'react-i18next';

interface ItemProps {
  cardinality?: number | null;
  dataType?: string | null;
  displayName?: string | null;
  entity?: string | null;
  keyType?: string | null;
  name?: string | null;
}

export interface FilterSelectProps extends WithTranslation {
  value: any;
  items: Array<ItemProps>;
  type: string;
  borderRadius?: string;
  backgroundColor?: string;
  placeholder?: string;
  onChange: (item: object) => void;
}

export type FilterSelectState = {
  anchorEl: any;
};